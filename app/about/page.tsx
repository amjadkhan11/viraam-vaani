"use client";

import { 
  Users, BookOpen, Award, TrendingUp, ArrowRight, 
  CheckCircle2, Star, LayoutGrid 
} from "lucide-react";
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden font-sans py-12 lg:py-5">
      
      {/* Brand Theme Mesh Gradients */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 h-[400px] w-[400px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">

        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Users size={12} className="text-blue-600" />
            About Our Institute
          </span>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-slate-950">
            Building Strong Futures with{" "}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600">
              Smart Education
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            We don’t just teach — we shape students into achievers. Our core ecosystem thrives on complete conceptual clarity, absolute discipline, and consistent results.
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, color: "text-blue-600 bg-blue-50 border-blue-200", stat: "95%", label: "Success Rate" },
            { icon: Users, color: "text-blue-900 bg-slate-100 border-slate-200", stat: "500+", label: "Active Students" },
            { icon: BookOpen, color: "text-blue-600 bg-blue-50 border-blue-200", stat: "5+", label: "Years Experience" },
            { icon: Award, color: "text-blue-900 bg-slate-100 border-slate-200", stat: "Top Tier", label: "Local Institute" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group p-5 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.02)] hover:border-blue-600/50 hover:shadow-lg transition-all duration-300 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center border ${item.color} transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={18} />
                </div>
                <h2 className="text-2xl font-black mt-3 text-slate-950 tracking-tight">{item.stat}</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">{item.label}</p>
              </div>
            )
          })}
        </div>

        {/* STORY + VISUAL CONTENT CARD GRID */}
        <div className="grid md:grid-cols-12 gap-8 items-center pt-2">

          {/* LEFT: BRAND STORY */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
                हमारी Journey 🚀
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full" />
            </div>

            <div className="text-slate-600 font-medium text-xs md:text-sm space-y-3 leading-relaxed">
              <p>
                <span className="font-bold text-slate-950">Viraam Vaani</span> is not just an educational space — it’s a movement of transformation. We believe every individual, no matter how lost or limited, carries the spark of greatness within.
              </p>
              <p>
                Our mission is to guide learners toward that inner awakening — where discipline meets confidence, and potential turns into performance. Through a unique blend of mentorship, motivation, and mindfulness, we help every student rediscover purpose and passion.
              </p>
              <div className="relative bg-blue-50/50 border-l-4 border-blue-600 p-3 rounded-r-xl italic text-slate-800 font-semibold text-xs shadow-sm">
                "At Viraam Vaani, every “Viraam” (pause) becomes a new beginning — a moment to reflect, reset, and rise stronger than before."
              </div>
            </div>

            {/* FOUNDER TRIGGER LINK */}
            <div className="pt-2">
              <Link href="/founder" className="inline-block w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm shadow-blue-600/10 group hover:scale-[1.01] active:scale-[0.99]">
                  <Users size={14} className="text-white" />
                  Meet Our Founder
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform text-white" />
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT: WHY STUDENTS LOVE US CARD */}
          <div className="md:col-span-5 relative w-full">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/5 to-blue-900/5 rounded-3xl blur-lg opacity-60" />
            
            <div className="relative bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-blue-600 uppercase mb-1">
                  <Star size={10} className="fill-blue-600 text-blue-600" /> Trust Factor
                </span>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  Why Students Love Us ❤️
                </h3>

                <ul className="mt-4 space-y-3">
                  {[
                    "Concept-based crisp learning ecosystems",
                    "Rigorous weekly tests & live analysis",
                    "Dedicated 1-on-1 doubt breakdown labs",
                    "Growth-driven, high-energy environment"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium leading-tight">
                      <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/admission" className="block mt-6">
                <button className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                  Enroll Now & Secure Seats
                </button>
              </Link>
            </div>
          </div>

        </div>

        {/* HIGH-END FEATURED MEDIA BANNER */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm pt-4">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-1 text-center md:text-left relative z-10 max-w-xl">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block">Media & Study Labs</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">Explore Knowledge Hub & Gallery</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Check out our student exhibition memories, workspace vlogs, and custom materials.
            </p>
          </div>
          
          <Link href="/media" className="shrink-0 relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm group hover:scale-[1.01] active:scale-[0.99]">
              <LayoutGrid size={14} className="text-white" />
              Open Media Gallery
              <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform text-white" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}