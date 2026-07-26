import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📥 1. FETCH NOTIFICATIONS (GET)
export async function GET(req: Request) {
  try {
    // Auto delete expired notifications
await prisma.notification.deleteMany({
  where: {
    expiryDate: {
      lt: new Date(),
    },
  },
});
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let whereCondition = {};

    if (role === "student") {
      whereCondition = {
        expiryDate: {
          gte: new Date(), // Live items tracking only
        },
      };
    }

    const notifications = await prisma.notification.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
    });

    // 🛡️ Safe Check: Frontend .map crash na ho
    return NextResponse.json(Array.isArray(notifications) ? notifications : []);
  } catch (error) {
    console.error("GET_NOTIFICATIONS_ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// 📤 2. CREATE NOTIFICATION (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.message || !body.expiryDate) {
      return NextResponse.json(
        { error: "Validation Failed: Missing required fields" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title: body.title,
        message: body.message,
        expiryDate: new Date(body.expiryDate), 
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("POST_NOTIFICATION_ERROR:", error);
    return NextResponse.json(
      { error: "Database context update failed. Did you run prisma db push?" },
      { status: 500 }
    );
  }
}

// 🗑️ 3. DELETE NOTIFICATION (DELETE) 👈 Ye naya section add kiya hai aapke liye
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Frontend se bheji gayi ID nikal rahe hain

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" }, 
        { status: 400 }
      );
    }

    // Database se delete karne ka logic
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notification deleted successfully ✅" });
  } catch (error) {
    console.error("DELETE_NOTIFICATION_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" }, 
      { status: 500 }
    );
  }
}