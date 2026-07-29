"use client";

import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { Megaphone, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
      
      {/* Main Poster Container */}
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200/90 overflow-hidden transform scale-100 transition-all duration-300">
        
        {/* Background Mesh Accent Blurs */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 z-10 shadow-sm cursor-pointer border-none outline-none"
        >
          <HiX size={20} />
        </button>

        {/* Poster Content */}
        <div className="text-center mt-2 relative z-10">
          
          {/* Dynamic Session Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles size={13} className="animate-pulse" /> Session {currentSession}
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            ADMISSIONS <span className="text-blue-700">OPEN</span>
          </h2>
          
          <p className="text-slate-600 font-medium text-xs md:text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Secure your seat at <strong className="text-slate-900">Viraam Vaani Academy</strong> today and take the first step towards a brighter academic future!
          </p>

          {/* Offer Box */}
          <div className="my-5 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3.5 text-left shadow-sm">
            <div className="p-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl text-white animate-bounce shrink-0 shadow-md">
              <Megaphone size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs md:text-sm text-blue-700 uppercase tracking-wide">Early Bird Offer!</h4>
              <p className="text-[11px] md:text-xs text-slate-600 font-medium leading-snug mt-0.5">
                Get a flat <strong className="text-slate-900">20% discount</strong> on registration fees for the first 50 students.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            <Link
              href="/admission"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:scale-[1.02] text-white font-extrabold py-3.5 rounded-xl transition-all duration-200 text-xs md:text-sm tracking-wide shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            >
              APPLY ONLINE NOW <ArrowRight size={16} />
            </Link>
            
            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold transition-colors py-1 cursor-pointer border-none outline-none"
            >
              I will check later
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}