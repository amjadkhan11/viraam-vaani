import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, className, password } = body;

    // 1. Mandatory Validation Check
    if (!name || !email || !phone || !className || !password) {
       return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 2. Check for Existing Email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // 3. Secure Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save to Database with default PENDING state
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        className,
        password: hashedPassword,
        status: "PENDING", // Strictly mapped with your UserStatus Enum
      },
    });

    // 5. Exclude password from returning payload
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser, // Clean client payload
    });

  } catch (error) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { error: "Registration Failed. Please try again later." },
      { status: 500 }
    );
  }
}