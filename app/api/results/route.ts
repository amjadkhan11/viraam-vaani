import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ----------------------------------------------------
// 1. GET RESULT BY EMAIL (Student View)
// ----------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await prisma.result.findFirst({
      where: {
        email: email.trim(),
      },
      orderBy: {
        createdAt: "desc", // Hamesha latest result pehle return karega
      }
    });

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET Result Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// 2. CREATE / PUBLISH SINGLE RESULT (Manual Form POST)
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validations (Kyunki custom fields manual form se aa rahe hain)
    if (!body.studentName || !body.rollNumber || !body.className) {
      return NextResponse.json(
        { error: "Missing required student details (Name, Roll Number, or Class)" },
        { status: 400 }
      );
    }

    // Number casting core engines ko completely safe banane ke liye
    const totalMarks = Number(body.totalMarksObtained || body.totalMarks || 0);
    const maxPool = Number(
      body.totalMaxMarksPool || 
      (body.subjects ? body.subjects.length * 100 : 0)
    );
    const finalPercentage = Number(body.percentage || (maxPool > 0 ? (totalMarks / maxPool) * 100 : 0));

    // Database operation with automated schema alignment fallbacks
    const result = await prisma.result.create({
      data: {
        studentName: body.studentName,
        fatherName: body.fatherName || "",
        email: body.email ? body.email.trim() : "",
        rollNumber: String(body.rollNumber).trim(), // Roll number safely conversion to string
        className: body.className,
        examName: body.examName,
        session: body.session || "2026-27",
        
        // Array payload containing individual subject maxMarks and calculated totalScores
        subjects: body.subjects || [], 

        totalMarksObtained: totalMarks,
        totalMaxMarksPool: maxPool,
        percentage: parseFloat(finalPercentage.toFixed(2)),

        // Custom manual parameters injected dynamically from admin desk UI fields
        classRank: body.classRank || body.rank || "N/A",
        performanceRemarks: body.performanceRemarks || body.remark || "Good",

        // Auto compilation engine division variables
        divisionStatus: body.divisionStatus || "Passed", 
        resultStatus: body.resultStatus || (body.divisionStatus === "FAIL" ? "FAILED" : "PASSED")
      },
    });

    return NextResponse.json({
      success: true,
      message: "Result Published Successfully",
      result,
    });
  } catch (error) {
    console.error("POST Result Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save result. Please ensure 'npx prisma db push' or migrations are applied to match columns.",
      },
      { status: 500 }
    );
  }
}