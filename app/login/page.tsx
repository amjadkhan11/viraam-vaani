"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("loginTimestamp", Date.now().toString());

        window.location.href = "/";
      } else {
        Swal.fire({
          icon: "error",
          title: "AUTHENTICATION FAILED",
          text: data.error || "Invalid user credentials.",
          confirmButtonColor: "#1e3a8a",
          customClass: { popup: "rounded-3xl font-sans" }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "CONNECTION ERROR",
        text: "Something went wrong while connecting to the auth hub.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl font-sans" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-auto md:h-screen w-full flex flex-col md:grid md:grid-cols-12 bg-slate-100 font-sans relative selection:bg-indigo-500/20">

      {/* DESKTOP LEFT SIDE PANEL */}
      <div className="hidden md:flex md:col-span-6 bg-gradient-to-br from-blue-950 via-indigo-950 to-indigo-900 relative flex-col justify-between p-12 text-white overflow-hidden shadow-2xl z-20">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />

        {/* CINEMATIC PERFECTLY ROUND LOGO (DESKTOP) */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-slate-950 to-slate-900 p-1 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo.jpeg"
              alt="Viraam Vaani Logo"
              width={56}
              height={56}
              priority
              className="rounded-full object-cover w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white block">Viraam Vaani</span>
    
          </div>
        </div>

        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 shadow-inner">
              <Sparkles size={14} className="animate-pulse" />
              Welcome Back
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Continue Your <br />
              Learning Journey.
            </h2>
            <p className="text-sm text-slate-300 font-medium max-w-xs leading-relaxed">
              Sign in to access your student dashboard, study materials, exam results, fee records, and important announcements.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-slate-200 font-bold">Secure Student Login</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-slate-200 font-bold">Access Everything in One Place</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PANEL */}
      {/* 🛠️ ADJUSTED: Added pb-8 on mobile to leave a decent visual gap before footer */}
      <div className="flex-1 md:col-span-6 flex flex-col justify-start md:justify-center items-center relative overflow-hidden px-4 w-full pt-6 pb-8 h-auto md:h-full">
        
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-200/30 blur-[120px] pointer-events-none" />

        {/* 🛠️ ADJUSTED: Added mb-6 on mobile to smoothly separate the badge from the incoming footer */}
        <div className="w-full max-w-md flex flex-col items-center relative z-10 mt-0 mb-6">
          
          {/* CINEMATIC LOGO HERO (MOBILE VIEW) */}
          <div className="flex md:hidden flex-col items-center text-center mb-3">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-slate-950 to-slate-900 p-0.5 border border-indigo-900/20 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src="/images/logo.jpeg"
                alt="Viraam Vaani Logo"
                width={44}
                height={44}
                priority
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <h1 className="text-lg font-black tracking-tight text-slate-950 mt-1 leading-none">
              Viraam <span className="text-indigo-700">Vaani</span>
            </h1>
            <p className="text-[8px] text-indigo-600 font-bold tracking-widest uppercase mt-0.5">Student Portal</p>
          </div>
          
          <div className="w-full bg-white border-2 border-slate-200 rounded-[24px] p-5 md:p-8 shadow-xl relative overflow-hidden flex flex-col">
            
            <div className="text-center mb-3.5 flex-shrink-0">
              <h2 className="text-base font-black tracking-tight text-slate-950">
                Welcome Back!
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Enter your email and password to access your student portal.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              
              {/* EMAIL INPUT */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-950 block pl-0.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-900 transition-colors">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    onChange={handleChange}
                    placeholder="amjad@viraamvaani.com"
                    className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-xl text-black font-medium placeholder-slate-400 text-xs outline-none transition-all focus:border-blue-700 focus:ring-4 focus:ring-blue-100 shadow-sm"
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-950 block pl-0.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-900 transition-colors">
                    <Lock size={14} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-white border-2 border-slate-300 rounded-xl text-black font-medium placeholder-slate-400 text-xs outline-none transition-all focus:border-blue-700 focus:ring-4 focus:ring-blue-100 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 shadow-md active:scale-[0.99] flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? "Validating Portal..." : "Sign In"}
                {!isLoading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform font-bold" />}
              </button>

            </form>

            <div className="mt-3.5 pt-2 border-t-2 border-slate-100 text-center flex-shrink-0">
              <p className="text-[10px] text-slate-800 font-bold">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-blue-900 hover:text-blue-950 font-black transition-all underline underline-offset-4 decoration-blue-900"
                >
                  Create an account
                </button>
              </p>
            </div>

          </div>

          {/* SECURE FOOTER BADGE */}
          <div className="mt-2 flex items-center gap-1.5 text-slate-950 font-black text-[8px] bg-white px-2.5 py-1 rounded-full border-2 border-slate-300 shadow-sm flex-shrink-0">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Secure Student Portal</span>
          </div>

        </div>
      </div>
    </div>
  );
}