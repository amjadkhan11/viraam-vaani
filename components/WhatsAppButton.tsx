"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Page load hone ke 3 second baad ek baar tooltip dikhega attention grab karne ke liye
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans pointer-events-none">
      
      {/* Tooltip Message Box */}
      {showTooltip && (
        <div className="mb-2 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-xl border border-slate-800 animate-bounce pointer-events-auto relative mr-1">
          <p className="flex items-center gap-1.5">
            Chat with Us
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white ml-1 font-bold text-xs"
            >
              ×
            </button>
          </p>
          {/* Tooltip arrow */}
          <div className="absolute right-4 -bottom-1 w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45" />
        </div>
      )}

      {/* Actual Floating Button - Compact size */}
      <a
        href="https://wa.me/919288024338?text=Hello%20Viraam%20Vaani%20Classes,%20I%20have%20an%20enquiry%20regarding%20admissions."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="pointer-events-auto w-11 h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 relative group"
      >
        {/* Pulsing Outer Glow ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-75 group-hover:animate-none" />
        
        {/* Icon size reduced from 32 to 22 (Perfectly small & professional) */}
        <FaWhatsapp size={22} className="relative z-10" />
      </a>
    </div>
  );
}