"use client";

import Link from "next/link";
import Image from "next/image";

export default function FounderProfilePage() {
  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden font-sans py-12 lg:py-5">
      
      {/* Light Mesh Accent Blurs (Royal Blue & Soft Gold) */}
      <div className="absolute top-0 left-1/3 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 h-[400px] w-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-10">
        
        {/* BACK TO ABOUT ACTION */}
        <div className="flex items-center justify-between">
          <Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-0.5 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to About
          </Link>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-500/20 shadow-sm">
            👑 Leadership & Vision
          </span>
        </div>

        {/* PROFILE MAIN SPLIT CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-2">
          
          {/* LEFT COLUMN: HERO PHOTO CONTAINER (Chota aur balanced kiya gaya hai) */}
          <div className="lg:col-span-4 max-w-sm mx-auto lg:mx-0 relative w-full sticky top-6">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 to-amber-500/10 rounded-[2.5rem] blur-xl opacity-70" />
            
            {/* The Main Image Asset Wrapper */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-white p-3 shadow-2xl group">
              <div className="relative aspect-[4/5] w-full rounded-2xl bg-gradient-to-b from-blue-50 to-slate-200 overflow-hidden flex items-center justify-center">
                
                {/* Image Container (Chehre se grid lines hata di gayi hain) */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src="/images/founder.jpeg"
                    alt="Founder MD Adil"
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

              </div>

              {/* FLOATING EXPERT METRIC CARD */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">Mentorship Core</span>
                  <p className="text-xs font-black text-slate-900">Transformation Focus</p>
                </div>
                <div className="flex gap-1.5 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
            </div>

            {/* SOCIAL ACTION CHANNELS */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-4 relative z-30">
                
                {/* 1. Direct Phone Call Action */}
                <a 
                  href="tel:+919304024338" 
                  title="Call Now"
                  className="w-12 h-12 rounded-[18px] bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-200 z-40 relative cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>

                {/* 2. Direct WhatsApp API Action */}
                <a 
                  href="https://wa.me/919304024338" 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="w-12 h-12 rounded-[18px] bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-105 transition-all duration-200 z-40 relative cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    <path d="M9 10a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a4 4 0 0 1-4-4v-1z" />
                  </svg>
                </a>

                {/* 3. Direct YouTube Redirection Action */}
                <a 
                  href="https://www.youtube.com/@ViraamVaani-i8k" 
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Watch on YouTube"
                  className="w-12 h-12 rounded-[18px] bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-200 z-40 relative cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                    <rect width="20" height="15" x="2" y="4" rx="3" />
                    <polygon points="10 9 15 11.5 10 14 10 9" />
                  </svg>
                </a>

              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN: EXECUTIVE STORIES & VALUES */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* NAME & ROLE HEADER BLOCK */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-900 text-xs font-black uppercase tracking-wider border border-blue-100 shadow-sm">
                Founder & CEO
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                MD Adil
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full" />
            </div>

            {/* GOLD LINE STATEMENT QUOTE */}
            <div className="relative bg-gradient-to-r from-blue-50 to-white border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm">
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 block mb-1">Core Belief System</span>
              <p className="text-sm md:text-base font-bold italic text-slate-800 leading-relaxed">
                “Every great dream begins with a small step. The journey of MD Adil is a living example of this belief.”
              </p>
            </div>

            {/* THE CONTEXT STORY AREA */}
            <div className="text-xs md:text-sm text-slate-600 font-medium space-y-4 leading-relaxed">
              <p>
                Coming from a modest background, he faced challenges that could have easily discouraged anyone. Yet, instead of stopping him, these struggles made him stronger and more determined.
              </p>
              <p>
                With limited resources and countless obstacles, his vision remained unshaken. What started as small efforts gradually transformed into a powerful journey that gave birth to <span className="font-bold text-blue-900">Viraam Vaani</span> — a platform that is not just about learning, but about inspiring students to turn their dreams into reality.
              </p>
            </div>

            {/* FINAL PRINCIPLE BRAND BLOCK */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">Vision Statement</h3>
              </div>
              <p className="text-xs md:text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                “True success lies in making others’ lives better through your hard work.”
              </p>
              <p className="text-xs text-slate-500 leading-tight">
                With this vision, he continues to create opportunities, guidance, and a brighter future for students across the community.
              </p>
            </div>

            {/* QUICK ACADEMY PILL TRUST FACTOR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c4 0 7-2 7-2s3 2 7 2a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg>
                <span className="text-[11px] font-bold text-slate-700">Personalized Mentorship Framework</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/xl" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
                <span className="text-[11px] font-bold text-slate-700">Direct Student Interaction Desk</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}