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
  PartyPopper,
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Selected notification for Read More
  const [selectedNotification, setSelectedNotification] = useState<any | null>(
    null
  );

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) =>
        console.error("Error fetching notifications:", err)
      );
  }, []);

  // 🕒 SMART DATE FORMATTER
  const formatSmartDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const dateZero = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const nowZero = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const diffTime = nowZero.getTime() - dateZero.getTime();
    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return { text: "Today", isUrgent: true };
    } else if (diffDays === 1) {
      return { text: "Yesterday", isUrgent: false };
    } else if (diffDays < 7) {
      return {
        text: `${diffDays} days ago`,
        isUrgent: false,
      };
    } else {
      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        text: formattedDate,
        isUrgent: false,
      };
    }
  };

  // 🏷️ AUTOMATIC CATEGORY FINDER
  const getCategoryConfig = (title: string) => {
    const lowerTitle = title.toLowerCase();

    if (
      lowerTitle.includes("exam") ||
      lowerTitle.includes("test") ||
      lowerTitle.includes("quiz")
    ) {
      return {
        label: "Exams & Tests",
        color:
          "bg-slate-100 text-slate-800 border-slate-200",
        bar: "from-orange-500 to-blue-700",
        icon: (
          <FileText
            size={14}
            className="text-orange-500"
          />
        ),
      };
    }

    if (
      lowerTitle.includes("admission") ||
      lowerTitle.includes("batch") ||
      lowerTitle.includes("register")
    ) {
      return {
        label: "Admissions",
        color:
          "bg-slate-100 text-green-600 border-slate-200",
        bar: "from-green-600 to-blue-600",
        icon: (
          <BookOpen
            size={14}
            className="text-green-600"
          />
        ),
      };
    }

    if (
      lowerTitle.includes("holiday") ||
      lowerTitle.includes("festival") ||
      lowerTitle.includes("celebration")
    ) {
      return {
        label: "Holidays",
        color:
          "bg-slate-100 text-slate-800 border-slate-200",
        bar: "from-blue-700 to-slate-900",
        icon: (
          <PartyPopper
            size={14}
            className="text-blue-600"
          />
        ),
      };
    }

    return {
      label: "General Notice",
      color:
        "bg-slate-100 text-blue-900 border-slate-200",
      bar: "from-blue-600 to-blue-900",
      icon: (
        <Megaphone
          size={14}
          className="text-blue-600"
        />
      ),
    };
  };

  const filteredNotifications = notifications.filter(
    (item) => {
      if (selectedFilter === "All") return true;

      const config = getCategoryConfig(item.title);

      return config.label === selectedFilter;
    }
  );

  const previewNotifications =
    filteredNotifications.slice(0, 4);

  // 🔵 OPEN SINGLE NOTIFICATION
  const openNotification = (item: any) => {
    setSelectedNotification(item);
    setIsOpen(true);
  };

  // 🔴 CLOSE POPUP
  const closeNotification = () => {
    setIsOpen(false);
    setSelectedNotification(null);
  };

  return (
    <section
      id="notifications"
      className="relative py-20 bg-slate-50 overflow-hidden font-sans"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-[-10%] h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 z-10">

        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold uppercase tracking-widest border border-slate-200 shadow-sm">

            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />

              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>

            <Bell
              size={13}
              className="text-blue-600"
            />

            Live Notice Board
          </span>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Latest{" "}
            <span className="text-blue-700">
              Updates
            </span>
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Check recent updates regarding schedules,
            examination grids, and fresh batch timelines
            here.
          </p>
        </div>

        {/* 🎛️ FILTERS */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">

          {[
            "All",
            "Exams & Tests",
            "Admissions",
            "Holidays",
            "General Notice",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setSelectedFilter(filter)
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS GRID */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

          {filteredNotifications.length === 0 ? (

            <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">

              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">

                <Bell
                  size={20}
                  className="text-slate-500"
                />

              </div>

              <h4 className="text-sm font-extrabold text-slate-900">
                No matching updates
              </h4>

              <p className="text-xs text-slate-500 font-medium mt-1">
                There are currently no circulars filed
                under "{selectedFilter}".
              </p>

            </div>

          ) : (

            previewNotifications.map((item: any) => {

              const config =
                getCategoryConfig(item.title);

              const dateInfo =
                formatSmartDate(item.createdAt);

              return (

                <div
                  key={item.id}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[400px]"
                >

                  {/* Left Gradient Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b ${config.bar}`}
                  />

                  <div className="space-y-4 pl-2">

                    {/* TOP ROW */}
                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <span
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${config.color}`}
                      >
                        {config.icon}
                        {config.label}
                      </span>

                      {dateInfo.isUrgent ? (

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-red-600 text-[9px] font-black uppercase border border-slate-200 flex items-center gap-1 animate-pulse">
                          NEW UPDATE
                        </span>

                      ) : (

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase border border-slate-200 flex items-center gap-1">

                          <Sparkles size={10} />

                          Notice

                        </span>

                      )}

                    </div>

                    {/* TITLE */}
                    <h3 className="text-base md:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    {/* SHORT MESSAGE PREVIEW */}
                    <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line line-clamp-5">
                      {item.message}
                    </p>

                    {/* READ MORE */}
                    <button
                      onClick={() =>
                        openNotification(item)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Read More
                      <ArrowRight size={13} />
                    </button>

                  </div>

                  {/* DATE FOOTER */}
                  <div className="mt-6 pt-4 border-t border-slate-200 pl-2 flex items-center text-xs font-semibold">

                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                        dateInfo.isUrgent
                          ? "bg-slate-100 text-green-600 border-slate-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >

                      <CalendarDays
                        size={13}
                        className={
                          dateInfo.isUrgent
                            ? "text-green-600"
                            : "text-slate-500"
                        }
                      />

                      <span>
                        {dateInfo.text}
                      </span>

                    </div>

                  </div>

                </div>

              );
            })

          )}

        </div>

        {/* VIEW ALL CTA */}
        {notifications.length > 0 && (

          <div className="mt-12 text-center">

            <button
              onClick={() => {
                setSelectedNotification(null);
                setIsOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md group"
            >

              Open Full Notice Archive

              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />

            </button>

          </div>

        )}

      </div>

      {/* ========================================================= */}
      {/* FULL NOTICE POPUP */}
      {/* ========================================================= */}

      {isOpen && (

        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[999] flex items-center justify-center p-4">

          <div className="bg-slate-50 w-full max-w-3xl max-h-[85vh] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">

            {/* POPUP HEADER */}
            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-10">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-blue-600">

                  <Bell
                    size={18}
                    className="animate-pulse"
                  />

                </div>

                <div>

                  <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                    {selectedNotification
                      ? "Notice Details"
                      : "Notice Board Hub"}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium">

                    {selectedNotification
                      ? "Full notification details"
                      : `Viewing total ${notifications.length} systematic records`}

                  </p>

                </div>

              </div>

              <button
                onClick={closeNotification}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-red-600 border border-slate-200 transition-all duration-200"
              >

                <X size={16} />

              </button>

            </div>

            {/* POPUP CONTENT */}
            <div
              className="flex-1 p-6 overflow-y-auto space-y-4"
              style={{ scrollbarWidth: "thin" }}
            >

              {/* ============================= */}
              {/* SINGLE NOTIFICATION */}
              {/* ============================= */}

              {selectedNotification ? (

                (() => {

                  const item =
                    selectedNotification;

                  const config =
                    getCategoryConfig(item.title);

                  const dateInfo =
                    formatSmartDate(item.createdAt);

                  return (

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">

                      <div
                        className={`absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b ${config.bar}`}
                      />

                      <div className="space-y-4 pl-2">

                        {/* CATEGORY + DATE */}
                        <div className="flex items-center justify-between gap-4 flex-wrap">

                          <span
                            className={`px-2.5 py-1 rounded-md border text-[9px] font-bold flex items-center gap-1 ${config.color}`}
                          >
                            {config.icon}
                            {config.label}
                          </span>

                          <span
                            className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${
                              dateInfo.isUrgent
                                ? "bg-slate-100 text-green-600 border-slate-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >

                            <CalendarDays size={12} />

                            {dateInfo.text}

                          </span>

                        </div>

                        {/* TITLE */}
                        <h4 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                          {item.title}
                        </h4>

                        {/* FULL MESSAGE */}
                        <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed whitespace-pre-line break-words">
                          {item.message}
                        </p>

                      </div>

                    </div>

                  );

                })()

              ) : (

                /* ============================= */
                /* FULL ARCHIVE */
                /* ============================= */

                [...notifications]
                  .reverse()
                  .map((item: any) => {

                    const config =
                      getCategoryConfig(item.title);

                    const dateInfo =
                      formatSmartDate(item.createdAt);

                    return (

                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all duration-200"
                      >

                        <div
                          className={`absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b ${config.bar}`}
                        />

                        <div className="space-y-3 pl-2">

                          {/* TOP */}
                          <div className="flex items-center justify-between gap-4 flex-wrap">

                            <span
                              className={`px-2.5 py-0.5 rounded-md border text-[9px] font-bold flex items-center gap-1 ${config.color}`}
                            >
                              {config.icon}
                              {config.label}
                            </span>

                            <span
                              className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${
                                dateInfo.isUrgent
                                  ? "bg-slate-100 text-green-600 border-slate-200"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}
                            >

                              <CalendarDays size={12} />

                              {dateInfo.text}

                            </span>

                          </div>

                          {/* TITLE */}
                          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                            {item.title}
                          </h4>

                          {/* FULL MESSAGE */}
                          <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line break-words">
                            {item.message}
                          </p>

                        </div>

                      </div>

                    );

                  })

              )}

            </div>

          </div>

        </div>

      )}

    </section>
  );
}