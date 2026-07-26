import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { students, className, examName, session } = await req.json();

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: "Students data is required" },
        { status: 400 }
      );
    }

    let uploaded = 0;
    for (const student of students) {
      const existingUser = await prisma.user.findUnique({
  where: {
    email: student.email,
  },
});

if (!existingUser) {
  continue; 
}
      const rollStr = student.rollNumber ? String(student.rollNumber).trim() : "";

      await prisma.result.create({
        data: {
          studentName: student.studentName,
          fatherName: student.fatherName,
          email: student.email,
          rollNumber: rollStr,

          className,
          examName,
          session,
          subjects: student.subjects, 

          totalMarksObtained: Number(student.totalMarksObtained || 0),
          totalMaxMarksPool: Number(student.totalMaxMarksPool || 0),
          percentage: parseFloat(student.percentage || 0),

          divisionStatus: student.divisionStatus,
          resultStatus: student.resultStatus,

          classRank: student.classRank || "N/A",
          performanceRemarks: student.performanceRemarks || "Good",
        },
      });

      uploaded++;
    }

    return NextResponse.json({
      success: true,
      count: uploaded,
    });
  } catch (error) {
    console.error("Bulk Upload Error Log:", error);

    return NextResponse.json(
      {
        error: "Bulk Upload Failed to save on server database.",
      },
      {
        status: 500,
      }
    );
  }
}