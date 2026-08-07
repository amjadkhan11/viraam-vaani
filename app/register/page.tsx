"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, Mail, Lock, Phone, GraduationCap, Sparkles, 
  ArrowRight, Eye, EyeOff, CheckCircle2, PartyPopper, Check, X 
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    className: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom Premium Popup States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setErrorMessage(""); // clear errors on typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Popup counter handling
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccessPopup && countdown === 0) {
      window.location.href = "/login";
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup, countdown]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.className) {
      setErrorMessage("Please select your class ❌");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(data.error || "Something went wrong during registration.");
      }
    } catch {
      setErrorMessage("Network error, please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-sans selection:bg-blue-500/20 md:grid md:grid-cols-12">
      
      {/* ============================================================== */}
      {/* DESKTOP LEFT SIDE PANEL                                        */}
      {/* ============================================================== */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12 text-white md:col-span-6 md:flex">
        {/* Glow Spheres matching 'Why Choose Us' background styling */}
        <div className="pointer-events-none absolute -top-40 left-0 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl" />

        {/* 🛡️ CLICKABLE LOGO (DESKTOP) */}
        <Link href="/" className="group relative z-10 flex w-fit cursor-pointer items-center gap-4">
          <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-200/30 bg-white/10 p-1.5 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-hover:border-white">
            <Image 
              src="/images/logo.jpeg" 
              alt="Viraam Vaani Logo" 
              width={56} 
              height={56} 
              priority
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>
            <span className="block text-2xl font-black tracking-tight text-white transition-colors group-hover:text-blue-200">Viraam Vaani</span>
            
          </div>
        </Link>

        <div className="relative z-10 my-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-50/10 px-3.5 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse text-amber-300" />
              Join Viraam Vaani
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white lg:text-4xl">
              Begin Your <br />Success Journey.
            </h2>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-blue-100/90">
              Register today and unlock access to your personalized student dashboard with all your academic resources.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
              <span className="text-xs font-bold text-white">Access Study Materials & Notes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
              <span className="text-xs font-bold text-white">View Results & Fee Records</span>
            </div>
          </div>
        </div>

        {/* FOOTER COPYRIGHT */}
        <div className="relative z-10 text-xs font-medium text-blue-200/70">
          © {new Date().getFullYear()} Viraam Vaani. All rights reserved.
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE PANEL                                               */}
      {/* ============================================================== */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-white px-4 py-8 md:col-span-6 md:px-12">
        
        {/* ENHANCED CLOSE BUTTON (TOP-RIGHT TO RETURN HOME) */}
        <Link
          href="/"
          title="Back to Home"
          className="group absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-md"
        >
          <X size={18} className="transition-transform duration-300 group-hover:rotate-90" />
        </Link>

        <div className="relative z-10 my-auto w-full max-w-md flex-col items-center">
          
          {/* 🛡️ MOBILE LOGO DISPLAY */}
          <Link href="/" className="group mb-4 flex cursor-pointer flex-col items-center text-center md:hidden">
            <div className="relative mb-1.5 flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-blue-700">
              <Image 
                src="/images/logo.jpeg" 
                alt="Viraam Vaani Logo" 
                width={56} 
                height={56} 
                priority
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
              Viraam Vaani
            </h1>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-700">Student Portal</p>
          </Link>
          
          {/* Form Card */}
          <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            
            <div className="mb-6 flex-shrink-0 text-center">
              <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                NEW REGISTRATION
              </span>
              <h2 className="mt-2.5 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Create Student Account
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Please register using your academic information
              </p>
            </div>

            {/* Inline Error Message State Layout */}
            {errorMessage && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-center text-xs font-bold text-rose-600">
                {errorMessage}
              </div>
            )}

            {/* Inputs area */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <Input icon={<User size={16} />} name="name" placeholder="Full Name" required onChange={handleChange} />
              <Input icon={<Mail size={16} />} name="email" type="email" placeholder="Email Address" required onChange={handleChange} />
              <Input icon={<Phone size={16} />} name="phone" placeholder="Phone Number" required onChange={handleChange} />
              
              {/* DROP-DOWN (WITHOUT "CLASS" PREFIX) */}
              <div className="group relative w-full">
                <div className="pointer-events-none absolute left-3.5 top-3 z-10 text-slate-400 transition-colors group-focus-within:text-blue-700">
                  <GraduationCap size={16} />
                </div>
                <select
                  name="className"
                  required
                  value={form.className}
                  onChange={handleChange}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-medium text-slate-900 outline-none transition-all focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled hidden>Select Class</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                  <option value="5th">5th</option>
                  <option value="6th">6th</option>
                  <option value="7th">7th</option>
                  <option value="8th">8th</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
                {/* Clean Dropdown Arrow */}
                <div className="pointer-events-none absolute right-3.5 top-3.5 text-[10px] text-slate-400">
                  ▼
                </div>
              </div>

              {/* Password Fields */}
              <div className="group relative w-full">
                <div className="pointer-events-none absolute left-3.5 top-3 text-slate-400 transition-colors group-focus-within:text-blue-700">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Password"
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="group relative w-full">
                <div className="pointer-events-none absolute left-3.5 top-3 text-slate-400 transition-colors group-focus-within:text-blue-700">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 text-xs font-bold tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-blue-800 active:scale-[0.99]"
              >
                Create Account
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

            </form>

            {/* Redirect Footer */}
            <div className="mt-5 flex-shrink-0 border-t border-slate-100 pt-3 text-center">
              <p className="text-xs font-semibold text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="inline-block cursor-pointer font-bold text-blue-700 transition-colors hover:text-blue-900 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>

          </div>

        </div>

        {/* MOBILE COPYRIGHT */}
        <div className="mt-6 block text-center text-xs text-slate-400 md:hidden">
          © {new Date().getFullYear()} Viraam Vaani. All rights reserved.
        </div>

      </div>

      {/* ============================================================== */}
      {/* PREMIUM CUSTOM SUCCESS MODAL POPUP LAYER                       */}
      {/* ============================================================== */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl">
            
            {/* Top Glowing Accent Line */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-blue-700" />
            
            {/* Celebration Animated Graphic Badge */}
            <div className="group relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-50 shadow-lg shadow-blue-100">
              <PartyPopper size={32} className="absolute -top-1 -right-1 rotate-12 animate-bounce text-blue-600" />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 shadow-md">
                <Check size={24} className="stroke-[3.5] text-white" />
              </div>
            </div>

            {/* Typography Content */}
            <h3 className="text-xl font-black tracking-tight text-slate-900">
              Registration Successful!
            </h3>
            <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-slate-600">
              Welcome aboard! Your student profile has been securely created in our portal.
            </p>

            {/* Interactive Progress Counter bar */}
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Redirecting to Login</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-700 text-xs font-black text-white shadow-sm">
                {countdown}s
              </span>
            </div>

            {/* Manual Immediate Action Button */}
            <button
              onClick={() => window.location.href = "/login"}
              className="mt-4 w-full cursor-pointer rounded-xl bg-slate-900 py-2.5 text-xs font-bold tracking-tight text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              Go to Login Page Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Custom Input Component
function Input({ icon, ...props }: any) {
  return (
    <div className="group relative w-full">
      <div className="pointer-events-none absolute left-3.5 top-3 text-slate-400 transition-colors group-focus-within:text-blue-700">
        {icon}
      </div>

      <input
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}