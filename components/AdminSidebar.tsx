"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // 🌟 FIX: useEffect ko import kiya
import Swal from "sweetalert2";
import {
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Trophy,
  Bell,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      name: "Student Approvals",
      href: "/admin/student-approvals",
      icon: UserCheck,
    },
    { name: "Students", href: "/admin/admissions", icon: Users },
    { name: "Materials", href: "/admin/materials", icon: BookOpen },
    { name: "Results", href: "/admin/result", icon: Trophy },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    {
      name: "Fee Structure", href: "/admin/fee-structure", icon: BookOpen,
    },
    {
      name: "Fees Record", href: "/admin/fee-records",icon: Users,   
    },
    {
      name: "Sarvam Record", href: "/admin/sarvam-records",icon: Users,   },
      { name: "Upload Admit Cards",href: "/admin/admit-cards/upload",icon: UserCheck},
  ];

  // 🌟 Logout logic jo browser se secure cookie aur localStorage ko clear karega
  const handleLogout = async () => {
    setOpen(false);
    try {
      // 1. Backend Logout API ko call karke server-side cookie expire karenge
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (res.ok) {
        // 2. LocalStorage saaf karenge
        localStorage.removeItem("adminLoggedIn");

        // 3. Pyaara sa dynamic Alert dikhayenge
        Swal.fire({
          icon: "success",
          title: "LOGGED OUT",
          text: "Session terminated successfully due to inactivity.",
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: "rounded-3xl font-sans bg-slate-900 text-white" }
        });

        // 4. Redirect to login page
        setTimeout(() => {
          window.location.href = "/admin/adminlogin";
        }, 1500);
      }
    } catch (error) {
      console.error("Logout karne me error aaya:", error);
    }
  };

  // ⏱️ AUTOMATIC 10-MINUTE LOGOUT TIMER LOGIC
  useEffect(() => {
    // 10 Minutes = 10 * 60 * 1000 milliseconds
    const INACTIVITY_LIMIT = 10 * 60 * 1000;
    let logoutTimer: NodeJS.Timeout;

    // Timer ko reset karne ka function
    const resetTimer = () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        handleLogout(); // 10 minute khatam hote hi logout trigger hoga
      }, INACTIVITY_LIMIT);
    };

    // In events par nazar rakhi jayegi (User active hai ya nahi)
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    // Har event par timer dubara 10 minute se shuru ho jayega
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Pehli baar component load hone par timer start karein
    resetTimer();

    // Cleanup functions jab user page badle ya logout ho jaye
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return (
    <>
      {/* 📱 PREMIUM STICKY MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md text-white h-16 flex items-center justify-between px-5 z-40 border-b border-slate-900 shadow-xl">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden bg-slate-900 border border-blue-500/20 shadow-md">
          <img
            src="/images/logo.jpeg"
            alt="Viraam Vaani Logo"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Right Side: Golden User Badge Trigger */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)] active:scale-95 transition-all duration-200"
        >
          <span className="text-[11px] font-medium tracking-wide text-slate-400">
            Welcome Back, <span className="font-bold text-amber-400">Md Adil</span>
          </span>
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs border border-amber-300/40 shadow-sm">
            A
          </div>
        </button>
      </div>

      {/* Backdrop Glass Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 lg:hidden transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🧭 PREMIUM ULTRA-DARK SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky
          top-0 bottom-0 right-0 lg:left-0
          w-72 h-screen
          bg-slate-950 text-slate-400
          z-[60] shrink-0 border-l lg:border-l-0 lg:border-r border-slate-900
          transform transition-transform duration-300 ease-in-out shadow-[[-20px_0_30px_rgba(0,0,0,0.5)]] lg:shadow-none
          ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="p-6 flex justify-between items-center border-b border-slate-900/60 bg-slate-950">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/30 shadow-lg shadow-blue-950/50">
              <img
                src="/images/logo.jpeg"
                alt="Viraam Vaani Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-wide leading-none">Viraam Vaani</h2>
              <span className="text-[10px] text-blue-400/90 font-bold tracking-widest uppercase mt-1.5 block">Md Adil</span>
            </div>
          </div>

          {/* Close Menu Button on Mobile */}
          <button
            className="lg:hidden p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col justify-between h-[calc(100vh-88px)] p-4">
          <nav className="space-y-2 overflow-y-auto">
            <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-600 uppercase mb-4">Main Navigation</p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                      : "hover:bg-slate-900/60 hover:text-slate-100 border border-transparent hover:border-slate-800/40"
                    }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 🛑 LOGOUT BUTTON PANEL */}
          <div className="pt-4 border-t border-slate-900/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-rose-400/90 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all duration-200"
            >
              <LogOut size={18} />
              Logout Session
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}