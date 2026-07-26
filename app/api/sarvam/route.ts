import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Aapka sahi Prisma client import

// ----------------------------------------------------
// 1. GET: Fetch all applications for Admin Panel
// ----------------------------------------------------
export async function GET() {
  try {
    const records = await prisma.sarvamApplication.findMany({
      orderBy: { createdAt: "desc" }, // Naye records sabse upar dikhenge
    });
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
  }
}

// ----------------------------------------------------
// 2. POST: Save new form data to Neon Database
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body.schoolName || !body.email || !body.phone) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    // Prisma DB Insertion
    const newApplication = await prisma.sarvamApplication.create({
      data: {
        schoolName: body.schoolName,
        principalName: body.principalName || "",
        studentStrength: body.studentStrength ? parseInt(body.studentStrength, 10) : 0, // Safely handle string to int conversion
        email: body.email.trim(),
        phone: body.phone.trim(),
        address: body.address || "",
        district: body.district || "",
        state: body.state || "",
        pincode: body.pincode || "",
        reason: body.reason || "",
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully!", data: newApplication }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Insertion Error:", error);
    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}

// ----------------------------------------------------
// 3. DELETE: Remove record by ID
// ----------------------------------------------------
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Prisma DB Deletion
    await prisma.sarvamApplication.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Record deleted successfully from database" }, { status: 200 });
  } catch (error) {
    console.error("Database Deletion Error:", error);
    return NextResponse.json({ message: "Deletion failed" }, { status: 500 });
  }
}