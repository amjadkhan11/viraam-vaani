"use client";

import {
  GraduationCap,
  FileCheck,
  LibraryBig,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <GraduationCap size={28} className="text-blue-900 group-hover:text-white transition-colors duration-300" />,
      title: "Expert Faculty",
      description:
        "Learn from experienced and dedicated teachers committed to your academic success.",
      badge: "Mentors",
    },
    {
      icon: <FileCheck size={28} className="text-indigo-600 group-hover:text-white transition-colors duration-300" />,
      title: "Weekly Tests",
      description:
        "Regular assessments and performance tracking to strengthen concepts and confidence.",
      badge: "Analysis",
    },
    {
      icon: <LibraryBig size={28} className="text-amber-600 group-hover:text-white transition-colors duration-300" />,
      title: "Study Materials",
      description:
        "Well-structured notes, assignments, PDFs and practice sheets for every subject.",
      badge: "Premium",
    },
    {
      icon: <Trophy size={28} className="text-emerald-600 group-hover:text-white transition-colors duration-300" />,
      title: "Excellent Results",
      description:
        "Personal mentoring and result-oriented guidance to help students achieve their goals.",
      badge: "Proven",
    },
  ];

  return (
    <section className="relative py-5 md:py-16 overflow-hidden bg-slate-50 font-sans">
      
      {/* Background Decorative Mesh & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <div className="absolute top-10 left-[-10%] h-[600px] w-[600px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] h-[600px] w-[600px] bg-amber-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 z-10">

        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-xs font-black uppercase tracking-widest border border-amber-200/60 shadow-sm">
            <Sparkles size={12} className="text-amber-600 animate-pulse" />
            Why Choose Us
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none">
            Why Choose <span className="bg-gradient-to-r from-blue-900 via-indigo-700 to-indigo-600 bg-clip-text text-transparent">Viraam Vaani</span> 
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            We combine quality education, expert mentorship, structured learning, and continuous evaluation to help students excel academically and build a successful future.
          </p>
        </div>

        {/* PREMIUM CARDS GRID */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="group bg-white border-2 border-slate-200/70 rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              {/* Invisible Background Light effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/10 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Card Top Row: Icon Container + Small Badge */}
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 group-hover:bg-gradient-to-br group-hover:from-blue-900 group-hover:to-indigo-700 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-indigo-900/20 transition-all duration-300 transform group-hover:rotate-3">
                  {item.icon}
                </div>
                
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors">
                  {item.badge}
                </span>
              </div>

              {/* Card Content */}
              <h3 className="mt-6 text-xl font-black text-slate-950 group-hover:text-blue-900 transition-colors duration-200 tracking-tight">
                {item.title}
              </h3>

              <p className="mt-3 text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}