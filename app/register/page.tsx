"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  User, Mail, Lock, Phone, GraduationCap, Sparkles, 
  ArrowRight, Eye, EyeOff, CheckCircle2, PartyPopper, Check 
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    className: "", // Isme selected option ki value save hogi
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom Premium Popup States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleChange = (e: any) => {
    setErrorMessage(""); // clear errors on typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Popup counter handling
  useEffect(() => {
    let timer: any;
    if (showSuccessPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccessPopup && countdown === 0) {
      window.location.href = "/login";
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup, countdown]);

  const handleSubmit = async (e: any) => {
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
    } catch (err) {
      setErrorMessage("Network error, please try again.");
    }
  };

  return (
    // 🛠️ CRITICAL FIX: Changed h-screen to h-auto on mobile view so it wraps content height naturally without bloating the footer gap
    <div className="h-auto md:h-screen w-full flex flex-col md:grid md:grid-cols-12 bg-slate-100 font-sans relative selection:bg-indigo-500/20">
      
      {/* ============================================================== */}
      {/* DESKTOP LEFT SIDE PANEL                                        */}
      {/* ============================================================== */}
      <div className="hidden md:flex md:col-span-6 bg-gradient-to-br from-blue-950 via-indigo-950 to-indigo-900 relative flex-col justify-between p-12 text-white overflow-hidden shadow-2xl z-20">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />

        {/* 🛡️ CINEMATIC PERFECTLY ROUND LOGO (DESKTOP) */}
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
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block mt-0.5">Student Portal</span>
          </div>
        </div>

        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 shadow-inner">
              <Sparkles size={14} className="animate-pulse" />
              Join Viraam Vaani
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
             Begin Your  <br />Success Journey.
              
            </h2>
            <p className="text-sm text-slate-300 font-medium max-w-xs leading-relaxed">
              Register today and unlock access to your personalized student dashboard with all your academic resources.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-slate-200 font-bold">Access Study Materials & Notes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-slate-200 font-bold"> View Results & Fee Records </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE PANEL (Perfect Centered Layout for Mobile & Web)    */}
      {/* ============================================================== */}
      <div className="flex-1 md:col-span-6 flex flex-col justify-start md:justify-center items-center relative overflow-hidden px-4 md:px-12 w-full pt-6 pb-8 h-auto md:h-full">
        
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-200/30 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md flex flex-col items-center relative z-10 mt-0 mb-6">
          
          {/* 🛡️ CINEMATIC PERFECTLY ROUND LOGO HERO (MOBILE VIEW) */}
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
          
          {/* Form Card */}
          <div className="w-full bg-white border-2 border-slate-200 rounded-[24px] p-5 md:p-8 shadow-xl relative overflow-hidden flex flex-col">
            
            <div className="text-center mb-3.5 flex-shrink-0">
              <h2 className="text-lg font-black tracking-tight text-slate-950">
                Create Student Account
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Please register using your academic information
              </p>
            </div>

            {/* Inline Error Message State Layout */}
            {errorMessage && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-xl text-center text-[11px] font-bold text-rose-600 animate-fadeIn">
                {errorMessage}
              </div>
            )}

            {/* Inputs area */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              <div className="space-y-3">
                <Input icon={<User size={15} />} name="name" placeholder="Full Name" required onChange={handleChange} />
                <Input icon={<Mail size={15} />} name="email" type="email" placeholder="Email Address" required onChange={handleChange} />
                <Input icon={<Phone size={15} />} name="phone" placeholder="Phone Number" required onChange={handleChange} />
                
                {/* 🛠️ UPDATED DROP-DOWN (WITHOUT "CLASS" PREFIX) */}
                <div className="relative group w-full">
                  <div className="absolute left-3 top-2.5 text-slate-600 group-focus-within:text-blue-900 transition-colors z-10 pointer-events-none">
                    <GraduationCap size={15} />
                  </div>
                  <select
                    name="className"
                    required
                    value={form.className}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2 bg-white border-2 border-slate-300 rounded-xl text-black font-medium text-xs outline-none transition-all focus:border-blue-700 focus:ring-4 focus:ring-blue-100 shadow-sm appearance-none cursor-pointer"
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
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-[9px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="relative group">
                <div className="absolute left-3 top-2.5 text-slate-600 group-focus-within:text-blue-900 transition-colors">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2 bg-white border-2 border-slate-300 rounded-xl text-black font-medium placeholder-slate-400 text-xs outline-none transition-all focus:border-blue-700 focus:ring-4 focus:ring-blue-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-2.5 text-slate-600 group-focus-within:text-blue-900 transition-colors">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-xl text-black font-medium placeholder-slate-400 text-xs outline-none transition-all focus:border-blue-700 focus:ring-4 focus:ring-blue-100 shadow-sm"
                />
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white py-2 rounded-xl text-xs font-black tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 group"
              >
                Create Account
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform font-bold" />
              </button>

            </form>

            {/* Redirect Footer */}
            <div className="mt-4 pt-2.5 border-t-2 border-slate-100 text-center flex-shrink-0">
              <p className="text-[11px] text-slate-800 font-bold">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-blue-900 hover:text-blue-950 font-black transition-all underline underline-offset-4 decoration-blue-900"
                >
                  Login
                </button>
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* PREMIUM CUSTOM SUCCESS MODAL POPUP LAYER                       */}
      {/* ============================================================== */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-fadeIn">
          <div className="bg-white rounded-[32px] border-2 border-slate-100 max-w-sm w-full p-8 text-center shadow-2xl relative overflow-hidden transform scale-100 transition-transform duration-300 animate-scaleUp">
            
            {/* Top Glowing Core */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600" />
            
            {/* Celebration Animated Graphic Badge */}
            <div className="relative mx-auto w-20 h-20 bg-emerald-50 border-4 border-white shadow-xl shadow-emerald-200/50 rounded-full flex items-center justify-center mb-5 group">
              <PartyPopper size={36} className="text-emerald-500 absolute -top-1 -right-1 rotate-12 animate-bounce" />
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <Check size={24} className="text-white font-black stroke-[3.5]" />
              </div>
            </div>

            {/* Typography Content */}
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">
              Registration Successful!
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 px-2">
              Welcome aboard! Your student profile has been securely updated in the database.
            </p>

            {/* Interactive Progress Counter bar */}
            <div className="mt-6 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wide text-slate-500 uppercase">Redirecting to Login</span>
              <span className="h-6 w-6 rounded-lg bg-indigo-950 text-white font-black text-xs flex items-center justify-center shadow-sm animate-pulse">
                {countdown}s
              </span>
            </div>

            {/* Manual Immediate Action Button */}
            <button
              onClick={() => window.location.href = "/login"}
              className="mt-4 w-full bg-slate-950 hover:bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold tracking-tight shadow-md transition-all active:scale-[0.98]"
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
    <div className="relative group w-full">
      <div className="absolute left-3 top-2 text-slate-600 group-focus-within:text-blue-900 transition-colors">
        {icon}
      </div>

      <input
        {...props}
        className="w-full pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-xl text-black font-medium placeholder-slate-400 text-xs outline-none transition-all focus:border-blue-700 focus:ring-4 focus:ring-blue-100 shadow-sm"
      />
    </div>
  );
}