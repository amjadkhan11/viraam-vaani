import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminAuth = request.cookies.get("adminAuth")?.value;

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/adminlogin"
  ) {
    if (adminAuth !== "true") {
      return NextResponse.redirect(
        new URL("/admin/adminlogin", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};