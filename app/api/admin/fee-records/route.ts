import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Current Month
    const now = new Date();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear();

    // Paid + Rejected Records
    const records = await prisma.monthlyFee.findMany({
      where: {
        status: {
          in: ["PAID", "REJECTED"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            className: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Cards

    const totalCollection = records
      .filter((r) => r.status === "PAID")
      .reduce((sum, r) => sum + r.amount, 0);

    const monthlyCollection = records
      .filter(
        (r) =>
          r.status === "PAID" &&
          r.month === currentMonth &&
          r.year === currentYear
      )
      .reduce((sum, r) => sum + r.amount, 0);

    const paidStudents = records.filter(
      (r) => r.status === "PAID"
    ).length;

    const rejectedStudents = records.filter(
      (r) => r.status === "REJECTED"
    ).length;

    return NextResponse.json({
      success: true,

      totalCollection,

      monthlyCollection,

      paidStudents,

      rejectedStudents,

      records,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Record ID required",
        },
        { status: 400 }
      );
    }

    await prisma.monthlyFee.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Fee record deleted successfully",
    });

  } catch (error) {
    console.error("Delete fee error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}