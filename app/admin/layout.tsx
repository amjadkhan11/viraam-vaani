"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page par sidebar hide
  if (pathname === "/admin/adminlogin") {
    return <>{children}</>;
  }

  return (
    <div className="lg:flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}