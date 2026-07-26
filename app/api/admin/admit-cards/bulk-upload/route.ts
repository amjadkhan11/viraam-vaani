import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { students } = body; // Frontend se students ka array aayega

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an array of students." },
        { status: 400 }
      );
    }

    // 🚀 Loop chalakar saare students ko database mein upsert (insert or update) karenge
    // Takki agar same roll number ka data dubara upload ho, toh crash na ho balki update ho jaye
    const uploadPromises = students.map((student) => {
      return prisma.admitCard.upsert({
        where: { rollNumber: String(student.rollNumber) },
        update: {
          studentName: student.studentName,
          registrationNo: student.registrationNo ? String(student.registrationNo) : null,
          parentName: student.parentName || null,
          dob: String(student.dob),
          batch: student.batch,
          email: student.email.toLowerCase().trim(),
          examName: student.examName,
          examDate: student.examDate,
          examDay: student.examDay,
          examTime: student.examTime,
          reportingTime: student.reportingTime,
          duration: student.duration,
          centerName: student.centerName,
          centerAddress: student.centerAddress,
          roomNo: student.roomNo ? String(student.roomNo) : null,
          seatNo: student.seatNo ? String(student.seatNo) : null,
        },
        create: {
          studentName: student.studentName,
          rollNumber: String(student.rollNumber),
          registrationNo: student.registrationNo ? String(student.registrationNo) : null,
          parentName: student.parentName || null,
          dob: String(student.dob),
          batch: student.batch,
          email: student.email.toLowerCase().trim(),
          examName: student.examName,
          examDate: student.examDate,
          examDay: student.examDay,
          examTime: student.examTime,
          reportingTime: student.reportingTime,
          duration: student.duration,
          centerName: student.centerName,
          centerAddress: student.centerAddress,
          roomNo: student.roomNo ? String(student.roomNo) : null,
          seatNo: student.seatNo ? String(student.seatNo) : null,
        },
      });
    });

    // Saare operations ek sath execute honge
    await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: `${students.length} Admit Cards uploaded/updated successfully!`,
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}