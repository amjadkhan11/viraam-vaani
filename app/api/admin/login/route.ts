import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const admin = await prisma.admin.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          error: "Invalid Username",
        },
        {
          status: 401,
        }
      );
    }

    if (admin.password !== body.password) {
      return NextResponse.json(
        {
          error: "Invalid Password",
        },
        {
          status: 401,
        }
      );
    }

   const response = NextResponse.json({
  success: true,
  message: "Login Successful",
});

response.cookies.set("adminAuth", "true", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24, // 1 Day
});

return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}