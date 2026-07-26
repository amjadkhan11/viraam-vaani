import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const className = searchParams.get("className"); // "All Classes" ke liye frontend se "" aayega
    const month = searchParams.get("month");         // "All Months" ke liye frontend se "" aayega
    const year = Number(searchParams.get("year"));

    // Ab hum sirf year check karenge, kyunki className aur month optional (All) ho sakte hain
    if (!year) {
      return NextResponse.json(
        {
          success: false,
          message: "Year is required.",
        },
        { status: 400 }
      );
    }

    // -------------------------------
    // Approved Students Filter
    // -------------------------------
    const studentWhere: any = { status: "APPROVED" };
    if (className) {
      studentWhere.className = className; // Agar specific class hai toh filter karo, nahi toh All Students
    }

    const students = await prisma.user.findMany({
      where: studentWhere,
      orderBy: {
        name: "asc",
      },
    });

    // -------------------------------
    // Fee Structure Mapping
    // -------------------------------
    // Saari active fee structures nikal lete hain taaki "All Classes" ke waqt har class ki alag fee map ho sake
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        isActive: true,
        ...(className ? { className } : {}),
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });

    // Ek unique map bana lete hain [className -> amount] ka
    const feeMap = new Map<string, number>();
    feeStructures.forEach((fee) => {
      if (!feeMap.has(fee.className)) {
        feeMap.set(fee.className, fee.amount);
      }
    });

    // -------------------------------
    // Monthly Fees Filter
    // -------------------------------
    const feeWhere: any = { year };
    if (month) feeWhere.month = month;
    if (className) {
      feeWhere.user = { className };
    }

    const monthlyFees = await prisma.monthlyFee.findMany({
      where: feeWhere,
    });

    // -------------------------------
    // Prepare Final Data
    // -------------------------------
    let paidStudents = 0;
    let pendingApproval = 0;
    let dueStudents = 0;
    let collection = 0;
    let totalExpectedFee = 0;

    const data = students.map((student) => {
      // Student ki class ke hisab se fee amount nikalo (default 0)
      const currentFeeAmount = feeMap.get(student.className) ?? 0;
      totalExpectedFee += currentFeeAmount;

      // Agar multiple months selected hain toh yahan logic safely match karega
      const feesForStudent = monthlyFees.filter((item) => item.userId === student.id);
      
      let status: "PAID" | "PENDING" | "DUE" = "DUE";

      if (feesForStudent.length > 0) {
        // Agar ek bhi payment pending hai toh pehle use dhyan me rakhein, varna PAID check karein
        const hasPending = feesForStudent.some(f => f.status === "PENDING");
        const hasPaid = feesForStudent.some(f => f.status === "PAID");

        if (hasPending) {
          status = "PENDING";
          pendingApproval++;
        } else if (hasPaid) {
          status = "PAID";
          paidStudents++;
          // Saare paid months ka amount jod lo
          const paidAmount = feesForStudent
            .filter(f => f.status === "PAID")
            .reduce((sum, f) => sum + f.amount, 0);
          collection += paidAmount;
        } else {
          status = "DUE";
          dueStudents++;
        }
      } else {
        status = "DUE";
        dueStudents++;
      }

      return {
        id: student.id,
        name: student.name,
        phone: student.phone,
        className: student.className,
        amount: currentFeeAmount,
        status,
      };
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalStudents: students.length,
        paidStudents,
        pendingApproval,
        dueStudents,
        collection,
        remaining: totalExpectedFee - collection,
      },
      students: data,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}