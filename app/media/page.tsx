"use client";

import { useState } from "react";
import { 
  ArrowLeft, LayoutGrid, Image as ImageIcon, 
  Video, Calendar, Award, Sparkles, ArrowUpRight, Palette 
} from "lucide-react";
import Link from "next/link";

export default function MediaGalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const categories = [
    { id: "all", label: "All Media" },
    { id: "campus", label: "Campus Life" },
    { id: "creativity", label: "Creativity Zone" },
    { id: "events", label: "Exhibitions & Events" },
    { id: "achievers", label: "Celebrations" },
  ];

  const galleryItems = [
    // ======= CAMPUS LIFE =======
    {
      id: 1,
      type: "image",
      category: "campus",
      title: "Nature's Classroom Environment",
      desc: "Special outdoor classes where teachers occasionally take students under the sacred Banyan tree for a peaceful, high-focus learning session.",
      date: "June 2026",
      image: "/images/campus1.jpeg",
      videoUrl: "",
    },
    {
      id: 2,
      type: "image",
      category: "campus",
      title: "Interactive Student Sessions",
      desc: "Teachers periodically organize open-air group discussions here, encouraging collaborative peer learning in the lap of nature.",
      date: "June 2026",
      image: "/images/campus.jpeg",
      videoUrl: "",
    },
    {
      id: 3,
      type: "image",
      category: "campus",
      title: "Mass Achievement Gathering",
      desc: "Our brilliant batch standing together after a successful learning cycle.",
      date: "May 2026",
      image: "/images/campus3.jpeg",
      
    },

    // ======= CREATIVITY ZONE =======
    {
      id: 4,
      type: "image",
      category: "creativity",
      title: "Creative India Map Project",
      desc: "Beautifully handcrafted geographical three-dimensional models created by students.",
      date: "June 2026",
      image: "/images/creativity.jpeg",
    
    },
    {
      id: 5,
      type: "image",
      category: "creativity",
      title: "Biology & Anatomy Showcase",
      desc: "Functional school models explaining intricate anatomical organs flawlessly.",
      date: "May 2026",
      image: "/images/creativity2.jpeg",
     
    },
    {
      id: 6,
      type: "image",
      category: "creativity",
      title: "Art & Craft Structural Design",
      desc: "Visual art projects displaying deep creative thinking and innovative crafting skills.",
      date: "April 2026",
      image: "/images/creatvity3.jpeg",
      
    },

    // ======= EXHIBITIONS & EVENTS =======
    {
      id: 7,
      type: "image",
      category: "events",
      title: "Active Presentation Seminars",
      desc: "Interactive educational events boosting student confidence and stage presence.",
      date: "June 2026",
      image: "/images/event.jpeg",
      
    },
    {
      id: 8,
      type: "image",
      category: "events",
      title: "Outdoor Educational Tour Group",
      desc: "Memorable moments from our field trip and real-world exposure exhibitions.",
      date: "May 2026",
      image: "/images/e4.jpeg",
      
    },
    {
      id: 9,
      type: "image",
      category: "events",
      title: "Classroom Speech & Debate Event",
      desc: "Students presenting complex analytical arguments on stage flawlessly.",
      date: "May 2026",
      image: "/images/e3.jpeg",
     
    },

    // ======= CELEBRATIONS (ACHIEVERS) =======
    {
      id: 10,
      type: "image",
      category: "achievers",
      title: "Annual Award Ceremony",
      desc: "Celebrating our bright students holding their certificates and medals proudly, awarded for their outstanding performance and exceptional dedication throughout the session.",
      date: "April 2026",
      image: "/images/campus3.jpeg",
     
    },
    {
      id: 11,
      type: "image",
      category: "achievers",
      title: "Children's Day Celebration",
      desc: "A glimpse of our wonderful students coming together to celebrate Children's Day with bright smiles, cake cutting, and fun collaborative classroom activities.",
      date: "April 2026",
      image: "/images/Celebrations.jpeg",
      
    },
    {
      id: 12,
      type: "image",
      category: "achievers",
      title: "Result Day & Farewell",
      desc: "Our dedicated scholars gathering on the final result day, receiving their performance sheets and tokens of appreciation for their consistent focus and sincere efforts.",
      date: "April 2026",
      image: "/images/e5.jpeg",
     
    },
  ];

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden font-sans py-12 lg:py-16">
      
      {/* Background Micro-Glow layers */}
      <div className="absolute top-0 left-1/4 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 h-[400px] w-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-10">
        
        {/* TOP BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors group">
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
            Back to About
          </Link>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-500/20 shadow-sm">
            🎯 Knowledge Hub
          </span>
        </div>

        {/* HERO TITLE */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
            Our Digital{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-amber-600 to-amber-500">
              Media Gallery
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
            Witness the environment where discipline meets excellence. Browse through our group activities, creative student projects, and proud award ceremonies.
          </p>
        </div>

        {/* NAVIGATION FILTERS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                activeFilter === cat.id
                  ? "bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-md shadow-blue-950/10 scale-[1.02]"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-900/40 hover:text-blue-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* PERFECT SYMMETRICAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Media Block Frame */}
              <div className="relative w-full aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                
                {imageErrors[item.id] ? (
                  /* Soft UI Clean placeholder fallback state (No random internet photo) */
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col justify-center items-center text-center p-4 space-y-1">
                    <ImageIcon className="text-slate-400 animate-pulse" size={24} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Image Loading...</p>
                  </div>
                ) : (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    /* object-cover is optimized with standard fallback handling */
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={() => handleImageError(item.id)}
                  />
                )}

                {/* Dynamic Category Badges */}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm border border-slate-200 text-[10px] font-black uppercase text-slate-800 shadow-sm z-20">
                  {item.category === "events" && <Sparkles size={10} className="text-amber-600" />}
                  {item.category === "campus" && <LayoutGrid size={10} className="text-blue-900" />}
                  {item.category === "creativity" && <Palette size={10} className="text-emerald-600" />}
                  {item.category === "achievers" && <Award size={10} className="text-amber-600" />}
                  {item.category === "achievers" ? "Celebration" : item.category === "events" ? "Events" : item.category === "campus" ? "Campus Life" : "Creativity"}
                </span>
              </div>

              {/* Text Information Description Blocks */}
              <div className="p-5 space-y-2 relative bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                      <Calendar size={10} />
                      {item.date}
                    </span>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-amber-600 transition-colors duration-200" />
                  </div>
                  <h3 className="text-base font-black text-slate-950 tracking-tight group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* FOOTER CTA */}
        <div className="text-center pt-6">
          <p className="text-xs font-bold text-slate-500">
            Want to watch more classroom archives? Subscribe to our official Viraam Vaani YouTube Channel.
          </p>
        </div>

      </div>
    </section>
  );
}