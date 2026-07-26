"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  CalendarDays, 
  ArrowRight, 
  Sparkles, 
  X, 
  BookOpen, 
  FileText, 
  Megaphone, 
  PartyPopper 
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  // 🕒 SMART DATE FORMATTER (Time removed for zero confusion)
  const formatSmartDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const dateZero = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowZero.getTime() - dateZero.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: "Today", isUrgent: true };
    } else if (diffDays === 1) {
      return { text: "Yesterday", isUrgent: false };
    } else if (diffDays < 7) {
      return { text: `${diffDays} days ago`, isUrgent: false };
    } else {
      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      return { text: `${formattedDate}`, isUrgent: false };
    }
  };

  // 🏷️ Automatic Category Finder
  const getCategoryConfig = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("exam") || lowerTitle.includes("test") || lowerTitle.includes("quiz")) {
      return { 
        label: "Exams & Tests", 
        color: "bg-amber-50 text-amber-700 border-amber-200/60", 
        bar: "from-amber-500 to-orange-600",
        icon: <FileText size={14} className="text-amber-600" />
      };
    }
    if (lowerTitle.includes("admission") || lowerTitle.includes("batch") || lowerTitle.includes("register")) {
      return { 
        label: "Admissions", 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200/60", 
        bar: "from-emerald-500 to-teal-600",
        icon: <BookOpen size={14} className="text-emerald-600" />
      };
    }
    if (lowerTitle.includes("holiday") || lowerTitle.includes("festival") || lowerTitle.includes("celebration")) {
      return { 
        label: "Holidays", 
        color: "bg-rose-50 text-rose-700 border-rose-200/60", 
        bar: "from-rose-500 to-pink-600",
        icon: <PartyPopper size={14} className="text-rose-600" />
      };
    }
    return { 
      label: "General Notice", 
      color: "bg-blue-50 text-blue-700 border-blue-200/60", 
      bar: "from-blue-600 to-indigo-600",
      icon: <Megaphone size={14} className="text-blue-600" />
    };
  };

  const filteredNotifications = notifications.filter(item => {
    if (selectedFilter === "All") return true;
    const config = getCategoryConfig(item.title);
    return config.label === selectedFilter;
  });

  const previewNotifications = filteredNotifications.slice(0, 4);

  return (
    <section id="notifications" className="relative py-20 bg-slate-50 overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-[-10%] h-[500px] w-[500px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 z-10">

        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-indigo-950 text-xs font-bold uppercase tracking-widest border border-slate-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <Bell size={13} className="text-indigo-600" />
            Live Notice Board
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
            Latest Announcements
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Check recent updates regarding schedules, examination grids, and fresh batch timelines here.
          </p>
        </div>

        {/* 🎛️ SMART UX FILTERS */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
          {["All", "Exams & Tests", "Admissions", "Holidays", "General Notice"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedFilter === filter
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS GRID AREA */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredNotifications.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell size={20} className="text-slate-400" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">No matching updates</h4>
              <p className="text-xs text-slate-400 font-medium mt-1">There are currently no circulars filed under "{selectedFilter}".</p>
            </div>
          ) : (
            previewNotifications.map((item: any) => {
              const config = getCategoryConfig(item.title);
              const dateInfo = formatSmartDate(item.createdAt);
              
              return (
                <div
                  key={item.id}
                  className="group bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b ${config.bar}`} />

                  <div className="space-y-4 pl-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                      
                      {dateInfo.isUrgent ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9px] font-black uppercase border border-rose-100 flex items-center gap-1 animate-pulse">
                          NEW UPDATE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase border border-slate-200 flex items-center gap-1">
                          <Sparkles size={10} /> Notice
                        </span>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-extrabold text-slate-950 group-hover:text-indigo-600 transition-colors tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                      {item.message}
                    </p>
                  </div>

                  {/* 🕒 CLEAN CLEAN DATE FOOTER */}
                  <div className="mt-6 pt-4 border-t border-slate-100 pl-2 flex items-center text-xs font-semibold">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      dateInfo.isUrgent 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-slate-50 text-slate-500 border-slate-200/60"
                    }`}>
                      <CalendarDays size={13} className={dateInfo.isUrgent ? "text-emerald-600" : "text-slate-400"} />
                      <span>{dateInfo.text}</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* VIEW ALL CTA BUTTON */}
        {notifications.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md group"
            >
              Open Full Notice Archive
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* FULL ARCHIVE POPUP MODAL                                       */}
      {/* ============================================================== */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[999] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-slate-50 w-full max-w-3xl h-[85vh] md:h-[80vh] rounded-[32px] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col transform transition-all scale-100 duration-300 animate-in zoom-in-95">
            
            {/* Sticky Header */}
            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Bell size={18} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-950 tracking-tight">Notice Board Hub</h3>
                  <p className="text-xs text-slate-500 font-medium">Viewing total {notifications.length} systematic records</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/80 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Feed Logs */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4" style={{ scrollbarWidth: 'thin' }}>
              {[...notifications].reverse().map((item: any) => {
                const config = getCategoryConfig(item.title);
                const dateInfo = formatSmartDate(item.createdAt);
                
                return (
                  <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all duration-200">
                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b ${config.bar}`} />
                    
                    <div className="space-y-3 pl-2">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-bold flex items-center gap-1 ${config.color}`}>
                          {config.icon} {config.label}
                        </span>
                        
                        <span className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${
                          dateInfo.isUrgent ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                        }`}>
                          <CalendarDays size={12} /> {dateInfo.text}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                        {item.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}