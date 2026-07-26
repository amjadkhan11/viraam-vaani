import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security practice: Keep message generic so hackers don't guess registered emails
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Validate Password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. User Status Checks
    if (user.status === "PENDING") {
      return NextResponse.json(
        { error: "🎉 Registration Successful! Your account is being verified and is usually approved within a few hours." },
        { status: 403 }
      );
    }

    if (user.status === "REJECTED") {
      return NextResponse.json(
        { error: "Your account registration has been rejected. Please contact the ViraamVaani Admin." },
        { status: 403 }
      );
    }

    
    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 5. Remove sensitive fields before sending user data to frontend
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      token,
      user: safeUser, // Password excluded safely
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Login Failed. Please try again later." },
      { status: 500 }
    );
  }
}