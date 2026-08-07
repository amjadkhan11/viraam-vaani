"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Admin, Login aur Register sabhi par Navbar/Footer/WhatsApp hide rahega
  const isAuthOrAdmin =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!isAuthOrAdmin && <Navbar />}

      <main className="flex-1">{children}</main>

      {!isAuthOrAdmin && <Footer />}

      {!isAuthOrAdmin && <WhatsAppButton />}
    </>
  );
}