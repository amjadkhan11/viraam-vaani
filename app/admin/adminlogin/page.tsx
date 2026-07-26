"use client";

import { useState } from "react";
import { User, Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        document.cookie = "adminAuth=true; path=/; max-age=86400; SameSite=Strict";
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "/admin/dashboard";
      } else {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: data.message || data.error || "Invalid username or password entered.",
          confirmButtonColor: "#1e3a8a",
          customClass: { popup: "rounded-2xl font-sans bg-white text-slate-800 border border-slate-200" }
        });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to the server. Please try again later.",
        confirmButtonColor: "#dc2626",
        customClass: { popup: "rounded-2xl font-sans bg-white text-slate-800 border border-slate-200" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
      
      {/* 🌌 Light Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 🚀 Viraam Vaani Premium Logo Header */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 border-2 border-amber-400 shadow-[0_8px_30px_rgb(30,58,138,0.06)] flex items-center justify-center overflow-hidden">
          <Image
            src="/images/logo.jpeg"
            alt="Viraam Vaani Logo"
            width={110}
            height={110}
            priority
            className="object-contain rounded-full"
          />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 tracking-wide">
          Viraam Vaani
        </h1>
        <p className="text-[11px] text-blue-900 font-bold tracking-wider uppercase mt-2 flex items-center gap-1.5 bg-blue-50 border border-blue-200/60 px-4 py-1 rounded-full shadow-sm">
          <ShieldCheck size={14} className="text-amber-500" /> Admin Portal
        </p>
      </div>

      <div className="relative w-full max-w-md z-10">
        
        {/* 💳 Login Box Card (Premium Light Mode) */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 px-0.5">
                  Username
                </label>
                <div className="relative group">
                  <User
                    size={16}
                    className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-900 transition-colors"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 px-0.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={16}
                    className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-900 transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-blue-900 hover:bg-blue-950 text-amber-400 border border-amber-400/30 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    Please wait...
                  </>
                ) : (
                  "Login"
                )}
              </button>

            </form>
          </div>

        </div>

        {/* Bottom Footer Sub-text */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-medium tracking-wide">
          Viraam Vaani Educational Institute © All Rights Reserved.
        </p>
      </div>
    </div>
  );
}