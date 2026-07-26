import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // 1. Bearer Token Extract karo Header se
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized access. Token missing." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return NextResponse.json(
        { error: "Session expired. Please Login Again" },
        { status: 401 }
      );
    }

    // 2. Token Ko Decode Karke Logged-In User Ka Email Pata Karo
    let loggedInUserEmail = "";
    try {
      const decoded: any = jwt.decode(token);
      
      if (!decoded || !decoded.email) {
        return NextResponse.json(
          { error: "Invalid Session Token. Please login again." },
          { status: 401 }
        );
      }
      loggedInUserEmail = decoded.email.toLowerCase().trim();
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to verify session." },
        { status: 401 }
      );
    }

    // 3. Request Body se Email Nikaalo
    const body = await req.json();
    const requestedEmail = body.email ? body.email.toLowerCase().trim() : "";

    if (!requestedEmail) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    // 🔒 MAIN SECURITY GUARD:
    if (loggedInUserEmail !== requestedEmail) {
      return NextResponse.json(
        { error: "Access Denied!" },
        { status: 403 }
      );
    }

    // 🔍 STEP 1: Database Check for User Status
    const existingUser = await prisma.user.findUnique({
      where: { email: loggedInUserEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Account not found on this portal. Please complete registration." },
        { status: 404 }
      );
    }

    if (existingUser.status !== "APPROVED") {
      return NextResponse.json(
        { error: `Account status: ${existingUser.status}. Contact admin.` },
        { status: 403 }
      );
    }

    // 🔍 STEP 2: Database Fetch Admit Card
    const admitCard = await prisma.admitCard.findFirst({
      where: { email: loggedInUserEmail },
    });

    if (!admitCard) {
      return NextResponse.json(
        { error: "Your admit card will be available soon." },
        { status: 404 }
      );
    }

    // 🚨 STEP 3: EXAM DATE EXPIRY CHECK (Exam Date + 1 Day Expiry)
    if (admitCard.examDate) {
      const examDate = new Date(admitCard.examDate);
      
      // Check if Date is Valid
      if (!isNaN(examDate.getTime())) {
        // Expiry Date = Exam Date + 1 Day (Set to 11:59:59 PM of the next day)
        const expiryDate = new Date(examDate);
        expiryDate.setDate(expiryDate.getDate() + 1);
        expiryDate.setHours(23, 59, 59, 999);

        const currentDate = new Date();

        // Agar aaj ki date Expiry Date ke baad ki hai:
        if (currentDate > expiryDate) {
          return NextResponse.json(
            { error: "This Admit Card has expired (Exam date passed)." },
            { status: 410 } // 410 status code means Resource Expired
          );
        }
      }
    }

    // Sab Sahi Hai -> Success Return
    return NextResponse.json({ success: true, data: admitCard });

  } catch (error) {
    console.error("Student verify error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}