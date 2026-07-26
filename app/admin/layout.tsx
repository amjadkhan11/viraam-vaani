"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Login page par auto logout timer nahi chalega
    if (pathname === "/admin/adminlogin") return;

    let timer: NodeJS.Timeout;

    const logout = async () => {
      try {
        await fetch("/api/logout", {
          method: "POST",
        });

        router.push("/admin/adminlogin");
      } catch (error) {
        console.log("Logout error:", error);
      }
    };

    const resetTimer = () => {
      clearTimeout(timer);

      // 5 minutes inactivity ke baad logout
      timer = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000);
    };

    // User activity detect karna
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Page open hote hi timer start
    resetTimer();

    return () => {
      clearTimeout(timer);

      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [pathname, router]);


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