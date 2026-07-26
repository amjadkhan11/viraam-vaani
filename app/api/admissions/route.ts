import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📄 1. GET: Saare Admissions Records Fetch Karne Ke Liye
export async function GET() {
  try {
    const admissions = await prisma.admission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(admissions, { status: 200 });
  } catch (error) {
    console.error("Prisma GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admissions data cluster" },
      { status: 500 }
    );
  }
}

// 📥 2. POST: Naya Form Data Submit Karne Ke Liye (Aapka Original Code)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const admission = await prisma.admission.create({
      data: {
        name: body.name,
        fatherName: body.fatherName,
        mobile: body.mobile,
        email: body.email,
        className: body.className,
        schoolName: body.schoolName, // 👈 Model field
        address: body.address,       // 👈 Model field
      },
    });

    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    console.error("Prisma POST Error:", error);
    return NextResponse.json(
      { error: "Failed to submit admission" },
      { status: 500 }
    );
  }
}

// 🗑️ 3. DELETE: Database Se Permanently Record Clear Karne Ke Liye
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check agar admin ne valid ID pass ki hai ya nahi
    if (!id) {
      return NextResponse.json(
        { error: "Missing Target Record ID Parameter" },
        { status: 400 }
      );
    }

    // 💥 PostgreSQL/MongoDB/MySQL se record ko permanently delete karna
    const deletedRecord = await prisma.admission.delete({
      where: {
        id: id, // 👈 Agar aapka schema `id` capital ya dynamic string use karta hai
      },
    });

    return NextResponse.json(
      { success: true, message: "Record permanently wiped out from DB.", deletedRecord },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Prisma DELETE Route Failure:", error);
    
    // Agar Record already database me nahi hai ya session closed hai
    return NextResponse.json(
      { error: "Failed to delete record. It might have already been purged." },
      { status: 500 }
    );
  }
}