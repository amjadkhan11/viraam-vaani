"use client";

import {
  School,
  BookOpen,
  GraduationCap,
  Atom,
  Award,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function Courses() {
  const courses = [
    {
      icon: <School size={26} className="text-green-600 group-hover:text-white transition-colors duration-300" />,
      title: "Class 1 - 5",
      subtitle: "Primary Foundation",
      description:
        "Strong fundamentals in Mathematics, English, Science and overall academic growth.",
      accent: "from-green-600 to-blue-600",
    },
    {
      icon: <BookOpen size={26} className="text-blue-600 group-hover:text-white transition-colors duration-300" />,
      title: "Class 6 - 8",
      subtitle: "Middle School Program",
      description:
        "Concept-based learning with regular assessments and personalized attention.",
      accent: "from-blue-600 to-blue-700",
    },
    {
      icon: <GraduationCap size={26} className="text-blue-700 group-hover:text-white transition-colors duration-300" />,
      title: "Class 9",
      subtitle: "Academic Excellence",
      description:
        "Focused preparation to strengthen concepts and improve academic performance.",
      accent: "from-blue-700 to-blue-900",
    },
    {
      icon: <Award size={26} className="text-blue-600 group-hover:text-white transition-colors duration-300" />,
      title: "Class 10",
      subtitle: "Board Preparation",
      description:
        "Comprehensive board exam preparation with tests, notes and doubt sessions.",
      accent: "from-blue-600 to-blue-900",
    },
    {
      icon: <Atom size={26} className="text-blue-700 group-hover:text-white transition-colors duration-300" />,
      title: "Class 11",
      subtitle: "Senior Secondary",
      description:
        "Advanced subject guidance with conceptual clarity and academic mentoring.",
      accent: "from-blue-700 to-slate-900",
    },
    {
      icon: <Trophy size={26} className="text-blue-900 group-hover:text-white transition-colors duration-300" />,
      title: "Class 12",
      subtitle: "Board Excellence",
      description:
        "Result-oriented coaching focused on achieving outstanding board exam results.",
      accent: "from-blue-900 to-slate-900",
    },
  ];

  return (
    <section id="courses" className="relative py-5 md:py-5 overflow-hidden bg-slate-50 font-sans">
      
      {/* Premium Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 z-10">

        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-black uppercase tracking-widest border border-slate-200 shadow-sm">
            <Sparkles size={12} className="text-blue-600 animate-pulse" />
            Our Courses
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-900">
  Explore Our <span className="text-blue-700">Programs</span>
</h2>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Structured academic programs designed to help students build strong foundations, excel in examinations, and achieve their academic goals.
          </p>
        </div>

        {/* CARDS GRID AREA */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group bg-white border-2 border-slate-200 rounded-[28px] p-6 lg:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Dynamic Icon Box */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-gradient-to-br ${course.accent} group-hover:border-transparent group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105`}>
                  {course.icon}
                </div>

                {/* Content */}
                <div className="mt-6 space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-700 tracking-wide uppercase">
                    {course.subtitle}
                  </p>
                </div>

                <p className="mt-4 text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}