import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MONTH_ORDER = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const className = searchParams.get("className"); // "All Classes" ke liye ""
    const month = searchParams.get("month"); // "All Months" ke liye ""
    const year = Number(searchParams.get("year"));

    if (!year) {
      return NextResponse.json(
        { success: false, message: "Year is required." },
        { status: 400 }
      );
    }

    // 1. Fetch Approved Students
    const studentWhere: any = { status: "APPROVED" };
    if (className) {
      studentWhere.className = className;
    }

    const students = await prisma.user.findMany({
      where: studentWhere,
      orderBy: { name: "asc" },
    });

    // 2. Fetch Fee Structures
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        isActive: true,
        ...(className ? { className } : {}),
      },
      orderBy: { effectiveFrom: "desc" },
    });

    const feeMap = new Map<string, number>();
    feeStructures.forEach((fee) => {
      if (!feeMap.has(fee.className)) {
        feeMap.set(fee.className, fee.amount);
      }
    });

    // 3. Fetch Monthly Fees (Admin Generated Records)
    const feeWhere: any = { year };
    if (className) {
      feeWhere.user = { className };
    }

    const monthlyFees = await prisma.monthlyFee.findMany({
      where: feeWhere,
    });

    // Admin ne kaun-kaun se months generate kiye hain
    const generatedMonths = Array.from(
      new Set(monthlyFees.map((f) => f.month))
    );

    let paidStudents = 0;
    let pendingApproval = 0;
    let dueStudents = 0;
    let collection = 0;
    let totalExpectedFee = 0;

    const data = students.map((student) => {
      const currentFeeAmount = feeMap.get(student.className) ?? 0;

      // Student Creation / Joining Date Check
      const studentCreatedDate = new Date(student.createdAt);
      const studentJoinedYear = studentCreatedDate.getFullYear();
      const studentJoinedMonthIndex = studentCreatedDate.getMonth(); // Jan=0, July=6, Aug=7

      const studentFees = monthlyFees.filter(
        (item) => item.userId === student.id
      );

      // 🔴 STRICT VALID MONTHS FILTERING:
      // Sirf wahi months aayenge jo Admin ne generate kiye hain AND student ke joining ke waqt/baad ke hain
      const validMonthsForStudent = generatedMonths.filter((m) => {
        const mIndex = MONTH_ORDER.indexOf(m.toLowerCase());

        // Future joining year check
        if (year < studentJoinedYear) return false;

        // Same joining year check (e.g. Saif August me aaya toh July uske liye invalid hoke hat jayega)
        if (
          year === studentJoinedYear &&
          mIndex !== -1 &&
          mIndex < studentJoinedMonthIndex
        ) {
          return false;
        }

        return true;
      });

      // Monthly Ledger Breakdown
      const monthlyBreakdown = validMonthsForStudent.map((m) => {
        const record = studentFees.find(
          (f) => f.month.toLowerCase() === m.toLowerCase()
        );

        let mStatus: "PAID" | "PENDING" | "DUE" = "DUE";
        let amount = currentFeeAmount;
        let utrNumber = null;

        if (record) {
          if (record.status === "PAID") mStatus = "PAID";
          else if (record.status === "PENDING") mStatus = "PENDING";
          amount = record.amount;
          utrNumber = record.utrNumber || null;
        }

        return {
          month: m,
          year,
          status: mStatus,
          amount,
          utrNumber,
        };
      });

      // Expected Collection logic based on Valid Generated Months
      totalExpectedFee += currentFeeAmount * monthlyBreakdown.length;

      // Actual Paid Collection
      const studentPaidRecords = studentFees.filter((f) => f.status === "PAID");
      studentPaidRecords.forEach((r) => {
        collection += r.amount;
      });

      // 🔴 STATUS DETERMINATION LOGIC (FIXED):
      let currentStatus: "PAID" | "PENDING" | "DUE" = "DUE";
      let isApplicable = true;

      if (month) {
        // Jab user dropdown me koi specific Month filter karta hai (Jaise "July")
        const target = monthlyBreakdown.find(
          (b) => b.month.toLowerCase() === month.toLowerCase()
        );

        if (target) {
          currentStatus = target.status;
        } else {
          // Agar yeh month is student ke liye valid hi nahi tha (Jaise Saif ke liye July)
          // Toh is student par yeh month APPLICABLE hi nahi hai
          isApplicable = false;
        }
      } else {
        // Jab "All Months" selected ho
        const hasDue = monthlyBreakdown.some((b) => b.status === "DUE");
        const hasPending = monthlyBreakdown.some((b) => b.status === "PENDING");

        if (monthlyBreakdown.length === 0) {
          // Agar student ke joining ke hisab se koi generated month banta hi nahi
          isApplicable = false;
        } else if (hasPending) {
          currentStatus = "PENDING";
        } else if (hasDue) {
          currentStatus = "DUE";
        } else {
          currentStatus = "PAID"; // Tabhi PAID hoga jab saare valid months actual me PAID hain
        }
      }

      // Counter statistics me sirf APPLICABLE students count honge
      if (isApplicable) {
        if (currentStatus === "PAID") {
          paidStudents++;
        } else if (currentStatus === "PENDING") {
          pendingApproval++;
        } else {
          dueStudents++;
        }
      }

      return {
        id: student.id,
        name: student.name,
        phone: student.phone,
        className: student.className,
        amount: currentFeeAmount,
        status: isApplicable ? currentStatus : "NOT_APPLICABLE",
        monthlyBreakdown,
      };
    });

    // Sirf wahi students response me bhejo jo selected month ke liye APPLICABLE hain
    const filteredStudentsData = data
      .filter((s) => s.status !== "NOT_APPLICABLE")
      .map((s) => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        className: s.className,
        amount: s.amount,
        status: s.status as "PAID" | "PENDING" | "DUE",
        monthlyBreakdown: s.monthlyBreakdown,
      }));

    return NextResponse.json({
      success: true,
      summary: {
        totalStudents: filteredStudentsData.length,
        paidStudents,
        pendingApproval,
        dueStudents,
        collection,
        remaining: Math.max(0, totalExpectedFee - collection),
      },
      students: filteredStudentsData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}