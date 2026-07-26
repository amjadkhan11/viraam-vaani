"use client";

import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  School,
  MapPin,
  GraduationCap,
  Sparkles,
  Send,
  PartyPopper,
  Check,
  Award,
  Download,
  BookOpen,
  Layers,
  CheckCircle2,
  HelpCircle,
  Users,
  Quote
} from "lucide-react";

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    mobile: "",
    email: "",
    className: "",
    schoolName: "",
    address: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSession, setCurrentSession] = useState("");

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYearShort = String(currentYear + 1).slice(-2);
    setCurrentSession(`${currentYear}-${nextYearShort}`);
  }, []);

  useEffect(() => {
    let timer: any;
    if (showSuccessPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccessPopup && countdown === 0) {
      setShowSuccessPopup(false);
      setCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup, countdown]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowSuccessPopup(true);
        setFormData({
          name: "",
          fatherName: "",
          mobile: "",
          email: "",
          className: "",
          schoolName: "",
          address: "",
        });
      } else {
        setErrorMessage("Something went wrong. Please check fields and try again. ❌");
      }
    } catch (err) {
      setErrorMessage("Network connection error. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden text-slate-800">

      {/* Premium Light Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-white py-12 px-5 border-b border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 border border-amber-500/20 px-4 py-1 rounded-full font-black text-xs tracking-widest uppercase shadow-sm">
            <Sparkles size={12} className="text-amber-600 animate-spin" />
            Admissions Process {currentSession || "2026-27"}
          </span>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none max-w-4xl mx-auto text-slate-900">
            Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-amber-600 to-blue-800 drop-shadow-sm">Viraam Vaani</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Secure your future through our structural merit-based admission journey. Fill out the registration form, understand your academic level, and clear the holistic assessment phases.
          </p>

          <p className="text-[10px] font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-md inline-block mt-2">
            Conducted by: Viraam Vaani Educational Evaluation Cell
          </p>
        </div>
      </section>

      {/* MAIN TWO-COLUMN SPLIT LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Academic Details & Information */}
        <div className="lg:col-span-7 space-y-8">

          {/* VV-HAES ACADEMIC LEVELS HUB */}
          <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl">
            <div className="mb-4">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">VV-HAES Architecture</span>
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-0.5">Holistic Admission System Academic Levels</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { level: "V1", target: "Class 6-7", color: "from-blue-500 to-blue-600" },
                { level: "V2", target: "Class 8", color: "from-indigo-500 to-indigo-600" },
                { level: "V3", target: "Class 9", color: "from-amber-500 to-amber-600" },
                { level: "V4", target: "Class 10", color: "from-emerald-500 to-emerald-600" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center text-center shadow-sm hover:border-slate-300 transition-all">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${item.color} text-white font-black text-xs flex items-center justify-center shadow-sm mb-1.5`}>
                    {item.level}
                  </div>
                  <span className="text-[11px] font-black text-slate-900">{item.target}</span>
                  <span className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">Level</span>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-2">
              <HelpCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[10px] font-medium text-amber-900 leading-relaxed">
                <strong>महत्वपूर्ण बिंदुः</strong> हर Level में यही 4 Stages होंगे, लेकिन प्रश्न और गतिविधियाँ कक्षा के स्तर के अनुसार कठिन होती जाएँगी।
              </p>
            </div>
          </div>

          {/* 4-STAGE ASSESSMENT SYSTEM */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Evaluation Matrix</span>
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-0.5">Assessment Stages & Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { stage: "Stage 1", title: "Academic & Thinking", marks: "30 Marks", desc: "Checks core cognitive, analytical abilities and subject foundations.", icon: <BookOpen size={14} />, color: "text-blue-600 bg-blue-50 border-blue-200" },
                { stage: "Stage 2", title: "Character & Personality", marks: "25 Marks", desc: "Evaluates psychological resilience, ethics, and moral perspective.", icon: <User size={14} />, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                { stage: "Stage 3", title: "Activity & Leadership", marks: "20 Marks", desc: "Tests field cooperation, project initiative, and physical reflexes.", icon: <Layers size={14} />, color: "text-amber-600 bg-amber-50 border-amber-200" },
                { stage: "Stage 4", title: "Personal Interview", marks: "25 Marks", desc: "Final feedback discussion and environmental alignment checklist.", icon: <Users size={14} />, color: "text-emerald-600 bg-emerald-50 border-emerald-200" }
              ].map((stg, i) => (
                <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl flex gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border ${stg.color}`}>
                    {stg.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{stg.stage}</span>
                      <span className="text-[9px] font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-full">{stg.marks}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{stg.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{stg.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GRADING & NOMENCLATURE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-800">
                <Award size={14} /> Grading Categories
              </h3>
              <div className="divide-y divide-slate-100 text-[11px]">
                {[
                  { range: "90-100", label: "Viraam Scholar", badge: "bg-purple-100 text-purple-700" },
                  { range: "75-89", label: "Gold Selection", badge: "bg-amber-100 text-amber-700" },
                  { range: "60-74", label: "Silver Selection", badge: "bg-slate-100 text-slate-700" },
                  { range: "Below 60", label: "Foundation/Bridge", badge: "bg-blue-100 text-blue-700" },
                ].map((row, rIdx) => (
                  <div key={rIdx} className="py-2 flex items-center justify-between font-medium">
                    <span className="text-slate-500 font-mono text-[10px]">{row.range}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${row.badge}`}>{row.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 size={14} /> Nomenclature Glossary
                </h3>
                <div className="space-y-1.5">
                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex gap-2 items-center">
                    <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-center">V1 - V4</span>
                    <span className="text-[10px] font-medium text-slate-700">Student's Class Level</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex gap-2 items-center">
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded text-center">Stage 1-4</span>
                    <span className="text-[10px] font-medium text-slate-700">Selection Stages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SYLLABUS PDF HUB */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-blue-800">
                <BookOpen size={14} className="stroke-[2.5]" />
                <h4 className="text-[11px] font-black uppercase tracking-wider">Entrance Test Structure</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Objective MCQs covering Aptitude, English, and Core Math/Science.
              </p>
            </div>
            <a
              href="/assets/sample-paper.pdf"
              download="Viraam_Vaani_Entrance_Sample_Paper.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-amber-500 hover:text-amber-700 text-slate-700 px-3 py-2 rounded-xl font-bold text-[11px] shadow-sm transition-all duration-200 whitespace-nowrap group"
            >
              <Download size={12} className="text-slate-500 group-hover:text-amber-600 transition-colors" />
              Sample Paper
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Admission Form & Motivation Quote */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">

          {/* Form Container */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-6 relative overflow-hidden">

            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

            <div className="text-center space-y-1 mb-5">
              <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900">
                Step 1: Admission Form
              </h2>
              <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto">
                Provide correct information to process your journey and generate Hall Ticket.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-center text-[11px] font-bold text-rose-600">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Student Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  Student Name
                </label>
                <div className="relative group/input">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Amjad Ansari"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Father Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  Father's Name
                </label>
                <div className="relative group/input">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="Enter father's name"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  WhatsApp Number
                </label>
                <div className="relative group/input">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  Email Address
                </label>
                <div className="relative group/input">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Class Dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  Select Class Level
                </label>
                <div className="relative group/input">
                  <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    name="className"
                    required
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choose Class</option>
                    <option value="1st">Class 1</option>
                    <option value="2nd">Class 2</option>
                    <option value="3rd">Class 3</option>
                    <option value="4th">Class 4</option>
                    <option value="5th">Class 5 </option>



                    <option value="6th">Class 6 </option>
                    <option value="7th">Class 7</option>
                    <option value="8th">Class 8 </option>
                    <option value="9th">Class 9 </option>
                    <option value="10th">Class 10 </option>
                    <option value="11th">Class 11</option>
                    <option value="12th">Class 12</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2 text-slate-400 text-[8px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* School Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  Current School Name
                </label>
                <div className="relative group/input">
                  <School size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="schoolName"
                    required
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">
                  Permanent Address
                </label>
                <div className="relative group/input">
                  <MapPin size={14} className="absolute left-3.5 top-2.5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                  <textarea
                    rows={2}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full postal address"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs text-slate-800 font-medium transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <span>Submit Form</span>
                  <Send size={12} className="stroke-[2.5]" />
                </button>
              </div>

            </form>
          </div>

          {/* NEW ELEGANT INSPIRATIONAL QUOTE BOX: Fills bottom space beautifully */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-slate-100 rounded-3xl p-5 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-6 -bottom-6 text-slate-800/20 opacity-30 pointer-events-none">
              <Quote size={120} />
            </div>

            <div className="relative space-y-2.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                Our Vision
              </div>

              <p className="text-xs font-semibold leading-relaxed tracking-wide text-slate-200 italic">
                "Education is not merely a means to pass examinations; it is a lifelong journey of building strong character, deep moral values, and inspiring leadership that contributes meaningfully to society."
              </p>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">
                  Viraam Vaani Institution
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  Est. Academic Excellence
                </span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* SUCCESS MODAL POPUP LAYER */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-[32px] border border-slate-200 max-w-sm w-full p-6 text-center shadow-2xl relative overflow-hidden transition-transform duration-300">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-700" />

            <div className="relative mx-auto w-16 h-16 bg-blue-50 border-4 border-slate-50 shadow-md rounded-full flex items-center justify-center mb-4">
              <PartyPopper size={30} className="text-amber-500 absolute -top-1 -right-1 rotate-12 animate-bounce" />
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                <Check size={20} className="text-white font-black stroke-[3.5]" />
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Admission Form Registered!
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5 px-1">
              Admission Registration Complete! Check your email for the verified **Entrance Assessment Exam pattern, test center timings and digital admit card guidelines**.
            </p>

            <div className="mt-5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Closing window in</span>
              <span className="h-5 w-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shadow-sm animate-pulse">
                {countdown}s
              </span>
            </div>

            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold tracking-tight transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}