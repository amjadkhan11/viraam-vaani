import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Server-side se cookie ko khatam (delete) karne ke liye maxAge: 0 lagate hain
  response.cookies.set("adminAuth", "", {
    path: "/",
    maxAge: 0, 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}