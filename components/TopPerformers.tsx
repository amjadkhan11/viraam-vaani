"use client";

import { Trophy, Star, Award, ShieldCheck } from "lucide-react";

const toppers = [
  {
    id: 1,
    name: "Aman Kr. Bharti",
    class: "Class 10th",
    percentage: "93.00%",
    image: "/images/aman.jpeg",
    rank: "Rank 1",
    tag: "Best Academic Excellence",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Aaditya",
    class: "Class 10th",
    percentage: "84.40%",
    image: "/images/aaditya.jpeg",
    rank: "Rank 2",
    tag: "Intellectual Excellence",
    color: "from-blue-600 to-indigo-600",
    glow: "shadow-blue-500/20",
    isFeatured: false,
  },
  {
    id: 3,
    name: "Sandeep Kr. Gupta",
    class: "Class 10th",
    percentage: "77.80%",
    image: "/images/sandeep.jpeg",
    rank: "Rank 3",
    tag: "Best Dedicated Scholar",
    color: "from-emerald-600 to-teal-600",
    glow: "shadow-emerald-500/20",
    isFeatured: false,
  },
];

export default function TopPerformers() {
  // Desktop standard layout: Rank 2 | Rank 1 (Center Highlighted) | Rank 3
  const orderedToppers = [toppers[1], toppers[0], toppers[2]];

  return (
    // 🛠️ FIXED: Reduced spacing from md:py-32 to py-6 md:py-8 to remove all extra gaps
    <section id="toppers" className="relative py-6 md:py-8 overflow-hidden bg-[#fafbfc] font-sans">
      
      {/* Background Microdots and Premium Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 z-10">

        {/* HEADER SECTION - Tight margins */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-slate-800 shadow-md">
            <Trophy size={11} className="text-amber-400 animate-pulse" />
            Wall of Fame
          </span>

          <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
            Our Top <span className="bg-gradient-to-r from-blue-700 to-indigo-900 bg-clip-text text-transparent">Performers</span>
          </h2>
        </div>

        {/* CARDS GRID AREA - 🛠️ FIXED: Optimized mt-8 spacing instead of heavy margins */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {orderedToppers.map((student) => (
            <div
              key={student.id}
              className={`group relative bg-white border-2 rounded-[32px] p-5 lg:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md
                ${student.isFeatured
                  ? "border-amber-400 md:scale-105 z-20 md:-translate-y-2 ring-4 ring-amber-400/5"
                  : "border-slate-200/70 z-10"
                }`}
            >
              {/* Top Dynamic Bar color logic */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${student.color}`} />

              <div>
                {/* Card Top Action Row */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md border ${
                    student.isFeatured 
                      ? "bg-amber-500 text-white border-transparent shadow-sm" 
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}>
                    {student.rank}
                  </span>
                  
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: student.isFeatured ? 5 : 4 }).map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                </div>

                {/* Image Block */}
                <div className="mt-4 flex justify-center">
                  <div className={`relative rounded-[24px] overflow-hidden p-[2.5px] bg-gradient-to-b ${student.color} shadow-md ${student.glow}`}>
                    <div className="w-36 h-44 md:w-32 md:h-40 lg:w-40 lg:h-48 rounded-[21px] overflow-hidden bg-slate-900 relative">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-full h-full object-cover object-top scale-100 group-hover:scale-102 transition-transform duration-300"
                        onError={(e: any) => {
                          e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Identity Text Info */}
                <div className="mt-4 text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
                    {student.name}
                    {student.isFeatured && <Award size={15} className="text-amber-500 flex-shrink-0" />}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {student.class}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider">
                      <ShieldCheck size={9} />
                      {student.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Display Area */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className={`relative overflow-hidden text-center py-2 rounded-2xl font-black text-2xl tracking-tighter border ${
                  student.isFeatured
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-sm"
                    : "bg-slate-950 text-white border-transparent"
                }`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1rem] pointer-events-none" />
                  <span className="text-[9px] uppercase tracking-widest font-bold opacity-75 block mb-0.5">
                    Aggregate Score
                  </span>
                  {student.percentage}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}