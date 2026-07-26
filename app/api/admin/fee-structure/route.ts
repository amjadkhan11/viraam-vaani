import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET METHOD: Fetch Fee Structures or Pending Approvals
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get("type");

    if (type === "pending") {
      const pendingTransactions = await prisma.monthlyFee.findMany({
        where: { status: "PENDING" },
        include: {
          user: {
            select: {
              name: true,
              className: true,
              phone: true,
            },
          },
        },
        orderBy: { id: "desc" },
      });

      return NextResponse.json({ success: true, data: pendingTransactions });
    }

    // Fetch Active Fee Structures
    const fees = await prisma.feeStructure.findMany({
      where: { isActive: true },
      orderBy: [{ year: "desc" }, { className: "asc" }],
    });

    return NextResponse.json({ success: true, fees: fees });

  } catch (error) {
    console.error("❌ GET Master API Error:", error);
    return NextResponse.json({ success: false, error: "Data could not be loaded." }, { status: 500 });
  }
}

// 2. POST METHOD: Generate Monthly Fees OR Create/Update Fee Rules
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get("type");

    // Monthly Fee Generation Logic
    if (type === "generate") {
      const now = new Date();
      const month = now.toLocaleString("en-US", { month: "long" });
      const year = now.getFullYear();

      const students = await prisma.user.findMany({
        where: { status: "APPROVED" },
      });

      let generated = 0;

      for (const student of students) {
        if (!student.className) continue;

        const cleanStudentClass = student.className.trim();

        const structure = await prisma.feeStructure.findFirst({
          where: {
            className: {
              equals: cleanStudentClass,
              mode: "insensitive",
            },
            year: year,
            isActive: true,
          },
        });

        if (!structure) continue;

        const alreadyExists = await prisma.monthlyFee.findFirst({
          where: {
            userId: student.id,
            month: month,
            year: year,
          },
        });

        if (alreadyExists) continue;

        await prisma.monthlyFee.create({
          data: {
            userId: student.id,
            feeStructureId: structure.id,
            month: month,
            year: year,
            amount: structure.amount,
            status: "UNPAID",
          },
        });

        generated++;
      }

      return NextResponse.json({
        success: true,
        generated,
        message: `Fee generated successfully for ${generated} students for ${month} ${year}.`,
      });
    }

    // Create or Update Fee Structure Rule
    const body = await req.json();
    const { className, amount, effectiveFrom, year } = body;

    if (!className || amount === undefined || amount === null) {
      return NextResponse.json(
        { success: false, error: "Class name and Amount are required!" },
        { status: 400 }
      );
    }

    const cleanClassName = className.trim();
    const parsedAmount = Number(amount);
    const parsedYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

    let finalEffectiveDate = new Date();
    if (effectiveFrom) {
      const tempDate = new Date(effectiveFrom);
      if (!isNaN(tempDate.getTime())) {
        finalEffectiveDate = tempDate;
      }
    }

    // Check if rule already exists
    const existingRule = await prisma.feeStructure.findFirst({
      where: {
        className: { equals: cleanClassName, mode: "insensitive" },
        year: parsedYear,
        isActive: true,
      },
    });

    let resultFee;

    if (existingRule) {
      // Step A: Update master fee structure
      resultFee = await prisma.feeStructure.update({
        where: { id: existingRule.id },
        data: {
          amount: parsedAmount,
          effectiveFrom: finalEffectiveDate,
        },
      });

      // Step B: Auto-sync UNPAID invoices for current month
      await prisma.monthlyFee.updateMany({
        where: {
          feeStructureId: existingRule.id,
          month: currentMonth,
          year: parsedYear,
          status: "UNPAID",
        },
        data: {
          amount: parsedAmount,
        },
      });

    } else {
      // Create new rule
      resultFee = await prisma.feeStructure.create({
        data: {
          className: cleanClassName,
          amount: parsedAmount,
          year: parsedYear,
          effectiveFrom: finalEffectiveDate,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      fee: resultFee,
      message: "Fee rule updated successfully and synced across all UNPAID student invoices!" 
    });

  } catch (error: any) {
    console.error("❌ POST API Crash Info:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Database validation failed." },
      { status: 500 }
    );
  }
}

// 3. PATCH METHOD: Handle Approval/Rejection (Fixes handleApproval Error)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { feeId, action } = body;

    if (!feeId || !action) {
      return NextResponse.json(
        { success: false, error: "Both feeId and action are required!" },
        { status: 400 }
      );
    }

    const finalStatus = action === "APPROVE" ? "PAID" : "REJECTED";

    const updatedFee = await prisma.monthlyFee.update({
      where: { id: feeId },
      data: { status: finalStatus },
    });

    return NextResponse.json({
      success: true,
      message: `Transaction status updated to ${finalStatus}.`,
      data: updatedFee,
    });

  } catch (error: any) {
    console.error("❌ PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Status update failed" },
      { status: 500 }
    );
  }
}

// 4. DELETE METHOD: Safely Remove or Deactivate Rules
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required!" }, { status: 400 });
    }

    try {
      await prisma.feeStructure.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Rule completely deleted." });
    } catch (e) {
      await prisma.feeStructure.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Fee structure deactivated and removed from active list.",
      });
    }

  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Delete operation failed." }, { status: 500 });
  }
}