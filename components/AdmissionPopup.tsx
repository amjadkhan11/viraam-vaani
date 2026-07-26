"use client";

import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { Megaphone, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState("");

  useEffect(() => {
    // 🗓️ AUTOMATIC SESSION CALCULATOR
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 

    let startYear = currentYear;
    let endYear = currentYear + 1;

    if (currentMonth < 3) {
      startYear = currentYear - 1;
      endYear = currentYear;
    }
    setCurrentSession(`${startYear} - ${endYear}`);

    // ⏰ STABILIZED TIME LIMIT CHECK (30 Minutes)
    const lastClosedTime = localStorage.getItem("admissionPopupClosedTime");
    const currentTime = Date.now();
    const timeLimit = 30 * 60 * 1000; 

    // Strict validation: Agar user ne time limit ke andar refresh kiya hai toh return ho jao
    if (lastClosedTime && (currentTime - parseInt(lastClosedTime)) < timeLimit) {
      return; 
    }

    // Agar limit poori ho chuki hai ya pehli baar aaya hai, tabhi popup open hoga
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Strict timing snapshot save kar rahe hain
    localStorage.setItem("admissionPopupClosedTime", Date.now().toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      
      {/* Main Poster Container */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl border border-amber-500/30 overflow-hidden transform scale-100 transition-all duration-300">
        
        {/* Background Glow effects */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />

        {/* ❌ CUT / CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all duration-200 z-10 shadow-md"
        >
          <HiX size={20} />
        </button>

        {/* Poster Content */}
        <div className="text-center mt-4">
          {/* Dynamic Session Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} className="animate-pulse" /> Session {currentSession}
          </div>

          {/* Heading */}
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            ADMISSIONS OPEN
          </h2>
          
          <p className="text-slate-300 font-medium text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Secure your seat at Viraam Vaani Academy today and take the first step towards a brighter academic future!
          </p>

          {/* Offer Box */}
          <div className="my-5 p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3.5 text-left">
            <div className="p-3 bg-amber-50 rounded-xl text-slate-950 animate-bounce">
              <Megaphone size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-400">Early Bird Offer!</h4>
              <p className="text-xs text-slate-400">Get a flat 20% discount on registration fees for the first 50 students.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            <Link
              href="/admission"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-extrabold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-amber-500/10 active:scale-[0.98]"
            >
              Apply Online Now
            </Link>
            
            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-white font-semibold transition-colors py-1"
            >
              I will check later
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}