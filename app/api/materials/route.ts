import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// --- 1. GET ALL MATERIALS ---
export async function GET() {
  try {
    const materials = await prisma.studyMaterial.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(materials as any);
  } catch (error) {
    console.error("GET MATERIAL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials", details: String(error) },
      { status: 500 }
    );
  }
}

// --- 2. CREATE NEW MATERIAL (POST) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    const material = await prisma.studyMaterial.create({
      data: {
        title: body.title,
        description: body.description || "",
        className: body.className,
        subject: body.subject,
        pdfUrl: body.fileUrl, 
      },
    });

    return NextResponse.json(material as any);
  } catch (error) {
    console.error("POST MATERIAL DB ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create material in database", details: String(error) },
      { status: 500 }
    );
  }
}

// --- 3. DELETE MATERIAL (Added 🔥) ---
export async function DELETE(req: Request) {
  try {
    // URL se query parameter nikalein (?id=...)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Material ID is required" },
        { status: 400 }
      );
    }

    // Database se delete karein
    // Note: Agar aapki Prisma schema me ID type 'Int' hai, toh id ki jagah 'Number(id)' pass karein.
    await prisma.studyMaterial.delete({
      where: {
        id: id, 
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Material deleted successfully from DB and Student page ✅" 
    });
  } catch (error) {
    console.error("DELETE MATERIAL DB ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete material", details: String(error) },
      { status: 500 }
    );
  }
}