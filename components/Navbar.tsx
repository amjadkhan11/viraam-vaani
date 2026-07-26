"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HiMenu,
  HiX,
} from "react-icons/hi";

import {
  Trophy,
  User,
  Bell,
  LogOut,
  Sparkles,
  ShieldAlert,
  CreditCard,
  HeartHandshake,
  IdCard, // 👈 Admit card ke liye icon import kiya
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  // 🚨 POPUP STATE MANAGEMENT
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Jab bhi page badlega, top mobile menu close ho jayega
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ⏱️ SESSION EXPIRE & IDLE TIMEOUT LOGIC
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 1. Absolute Expiry Check
    const checkSessionExpiry = () => {
      const loginTimestamp = localStorage.getItem("loginTimestamp");
      const token = localStorage.getItem("token");

      if (token && loginTimestamp) {
        const sessionLimit = 30 * 60 * 1000; // 30 Minutes
        const timePassed = Date.now() - parseInt(loginTimestamp);

        if (timePassed > sessionLimit) {
          triggerAutoLogout("Your security session has expired!");
        }
      }
    };

    // 2. Idle Tracker (Inactivity based)
    let idleTimer: NodeJS.Timeout;
    const idleLimit = 5 * 60 * 1000; // 5 Minutes idle time limit

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (localStorage.getItem("token")) {
        idleTimer = setTimeout(() => {
          triggerAutoLogout("Logged out due to inactivity!");
        }, idleLimit);
      }
    };

    // Premium Popup Handler instead of basic alert
    const triggerAutoLogout = (message: string) => {
      setPopupMessage(message);
      setShowPopup(true);

      // Cleanup credentials immediately
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTimestamp");

      // 3 seconds ke countdown ke baad redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    };

    // Listeners for user activity
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    checkSessionExpiry();
    resetIdleTimer();

    const sessionInterval = setInterval(checkSessionExpiry, 15000);

    return () => {
      clearTimeout(idleTimer);
      clearInterval(sessionInterval);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTimestamp");
    window.location.href = "/";
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return "Student";
    return fullName.trim().split(" ")[0];
  };

  const navItemBase = "px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 relative";

  return (
    <>
      {/* CSS and Keyframes Animation */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress-shrink {
          animation: shrink 3s linear forwards;
        }
      `}</style>

      {/* ========================================== */}
      {/* 🚀 PREMIUM AUTO-LOGOUT POPUP (MODAL)      */}
      {/* ========================================== */}
      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden transform scale-100 transition-all duration-300">
            
            {/* Warning Glow Effect & Icon */}
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-inner relative">
              <ShieldAlert className="text-amber-500 animate-bounce" size={32} />
              <span className="absolute inline-flex h-full w-full rounded-2xl bg-amber-400 opacity-10 animate-ping"></span>
            </div>

            {/* Content */}
            <h3 className="text-slate-950 font-black text-xl tracking-tight mb-1">Session Timeout</h3>
            <p className="text-xs text-slate-500 font-medium px-2 leading-relaxed">
              {popupMessage} Redirection to the safety hub portal in progress...
            </p>

            {/* Spinner Redirect Loader */}
            <div className="mt-5 flex items-center justify-center gap-2 text-blue-900 font-extrabold text-[11px] uppercase tracking-wider">
              <div className="w-4 h-4 border-2 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
              Securing Portal...
            </div>

            {/* Visual Progress Countdown Line */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-600 animate-progress-shrink" />
          </div>
        </div>
      )}

      {/* Navbar Content */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-11 w-11 rounded-full bg-white flex items-center justify-center border border-slate-200/80 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 overflow-hidden">
                <div className="absolute inset-[3px] rounded-full border-[2.5px] border-dashed border-slate-800 opacity-90 animate-[spin_120s_linear_infinite]" />
                
                {/* Inner Solid Geometric 'A' Icon */}
                <div className="relative flex flex-col items-center justify-center z-10 scale-95 mt-[-2px]">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[17px] border-b-slate-800 relative flex justify-center">
                    {/* Cutout to make it look like the Viraam Vaani 'A' */}
                    <div className="absolute top-[8px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-white" />
                  </div>
                  {/* Horizontal Base Bar of 'A' */}
                  <div className="w-[18px] h-[3px] bg-slate-800 rounded-sm mt-[1px]" />
                </div>
              </div>

              {/* 📝 TYPOGRAPHY & BRAND NAME */}
              <div className="flex flex-col justify-center leading-none">
                <h1 className="font-black text-base lg:text-lg tracking-tight">
                  <span className="text-blue-950 bg-gradient-to-r from-blue-950 to-slate-900 bg-clip-text">Viraam</span>{" "}
                  <span className="text-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text">Vaani</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2 bg-slate-100 px-2 py-2 rounded-full">
              {[
                { href: "/", label: "Home" },
                { href: "/admission", label: "Admission" },
                { href: "/study-material", label: "Study Material" },
                { href: "/notifications", label: "Notifications", hasNotificationDot: true },
                { href: "/about", label: "About" },
                { href: "/sarvam", label: "Sarvam" ,icon: HeartHandshake}
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${navItemBase} ${
                      isActive 
                        ? "text-blue-900 bg-white shadow-md" 
                        : "text-slate-600 hover:text-blue-900 hover:bg-white/60"
                    }`}
                  >
                    {item.icon && <item.icon size={16} className="text-rose-600" />}
                    {item.label}
                    {item.hasNotificationDot && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-blue-900 to-indigo-700 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Dynamic Area */}
            <div className="hidden lg:flex items-center gap-3">
              {!user ? (
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white px-5 py-2 rounded-full font-semibold border-none outline-none shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all duration-300 group shadow-sm"
                >
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900 transition-colors">
                    Welcome, <span className="text-blue-900 font-extrabold capitalize">{getFirstName(user?.name)}</span> 👋
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md ring-2 ring-amber-200 group-hover:scale-105 transition-transform">
                    {user?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                </button>
              )}
            </div>

            {/* Mobile Menu & Avatar Toggle Area */}
            <div className="flex lg:hidden items-center gap-2">
              {user && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-1.5 py-1 pl-2 pr-1 rounded-full bg-slate-50 border border-slate-200 shadow-sm active:scale-95 transition-all"
                >
                  <span className="text-[10px] font-black text-slate-600 capitalize">
                    Hi, {getFirstName(user?.name)}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center ring-2 ring-amber-200">
                    {user?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                </button>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-900 text-white p-2 rounded-lg relative"
              >
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Nav Top Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="flex flex-col p-4 gap-3 font-semibold">
              {[
                { href: "/", label: "Home" },
                { href: "/admission", label: "Admission" },
                { href: "/study-material", label: "Study Material" },
                { href: "/notifications", label: "Notifications", hasNotificationDot: true },
                { href: "/about", label: "About" },
                { href: "/sarvam", label: "Sarvam" }
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-1 px-2 rounded-md ${
                      isActive ? "text-blue-900 bg-blue-50/60 font-bold border-l-4 border-blue-900 pl-2" : "text-slate-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.hasNotificationDot && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}

              {!user && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white text-center py-2 rounded-xl font-semibold mt-1"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Premium Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-80 bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[100] transform transition-transform duration-300 ease-out border-l border-amber-500/20 flex flex-col justify-between overflow-hidden no-scrollbar ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col">
          <div className="relative p-4 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-b border-amber-500/20 flex justify-between items-center overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
            <div className="z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
                <Sparkles size={10} className="animate-pulse" /> Welcome, {user ? getFirstName(user?.name) : "Student"}
              </div>
              <h2 className="font-extrabold text-xl bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                Viraam Vaani
              </h2>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="z-10 p-1.5 rounded-full bg-white/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all duration-200 shadow-inner"
            >
              <HiX size={18} />
            </button>
          </div>

          {/* Profile Card */}
          <div className="p-4 text-center border-b border-amber-500/10 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="relative w-16 h-16 mx-auto group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 animate-spin-slow opacity-70 p-[2px] shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <div className="w-full h-full bg-slate-900 rounded-full" />
              </div>
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center text-2xl font-black border border-amber-400/30 shadow-inner">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <span className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-slate-950 shadow-sm">
                {user?.className || "8th"}
              </span>
            </div>
            <h3 className="mt-2.5 font-bold text-base tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent capitalize">
              {user?.name || "Amjad Ansari"}
            </h3>
            <p className="text-[9px] text-amber-400/70 font-semibold tracking-wider mt-0.5 uppercase">
              Active Account
            </p>
          </div>
        </div>

        {/* Links Container */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-2">
          {[
            { href: "/dashboard/profile", label: "Profile", icon: User },
            { href: "/fee", label: "Fees Page", icon: CreditCard }, 
            { href: "/admit-card", label: "Admit Card", icon: IdCard }, // 👈 Yahan Admit Card add kar diya hai
            {
              href: user?.rollNumber
                ? `/dashboard/results?roll=${user.rollNumber}`
                : "/dashboard/results",
              label: "Results",
              icon: Trophy,
            },
            { href: "/notifications", label: "Notifications", icon: Bell, hasBadge: true },
          ].map((item) => {
            const Icon = item.icon;
            const isSidebarItemActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 group min-h-[56px] ${
                  isSidebarItemActive
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold"
                    : "border-white/[0.03] bg-white/[0.02] text-slate-300 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-transparent hover:border-amber-500/30 hover:text-amber-400"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-xl transition-colors relative ${
                    isSidebarItemActive ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.04] text-slate-400 group-hover:bg-amber-500/20 group-hover:text-amber-400"
                  }`}>
                    {item.hasBadge && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                      </span>
                    )}
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold tracking-wide text-sm">{item.label}</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isSidebarItemActive ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" : "bg-transparent group-hover:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]"
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Premium Logout Button Section */}
        <div className="p-4 border-t border-white/[0.05] bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600/90 to-red-700 hover:from-red-600 hover:to-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold tracking-wide text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-red-950/30 hover:shadow-red-600/20 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Logout Securely
          </button>
        </div>

      </div>
    </>
  );
}