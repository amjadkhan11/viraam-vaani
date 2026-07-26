import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Next.js App Router me context dusre parameter me milta hai params ke roop me
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js versions ke safe compatibility ke liye params resolve karna
    const params = await context.params;
    const studentId = params.id;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID missing in URL parameters" },
        { status: 400 }
      );
    }

    // Database se permanently user ko delete karna
    await prisma.user.delete({
      where: {
        id: studentId,
      },
    });

    return NextResponse.json(
      { message: "Student completely removed from Viraam Vaani DB" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Node Error:", error);
    return NextResponse.json(
      { error: "Failed to sync deletion with database stream" },
      { status: 500 }
    );
  }
}