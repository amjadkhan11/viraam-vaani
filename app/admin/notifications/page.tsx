"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Send,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2, // ✨ Success Icon Added
  X,
  PlusCircle,
  Megaphone
} from "lucide-react";

// 📝 Expandable Message Component
function ExpandableMessage({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = text.split("\n");
  const isLongText = text.length > 150 || words.length > 2;

  return (
    <div className="space-y-1">
      <p className={`text-slate-600 text-sm whitespace-pre-line leading-relaxed transition-all duration-300 ${!isExpanded && isLongText ? "line-clamp-2" : ""}`}>
        {text}
      </p>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 pt-0.5 transition-all"
        >
          {isExpanded ? (
            <>Read Less <ChevronUp size={14} /></>
          ) : (
            <>Read More <ChevronDown size={14} /></>
          )}
        </button>
      )}
    </div>
  );
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); 
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚨 UPDATED CUSTOM MODAL STATE FOR SUCCESS SUPPORT
  const [customModal, setCustomModal] = useState<{
    isOpen: boolean;
    type: "delete" | "warning" | "success"; // ✨ Added 'success' type
    title: string;
    description: string;
    targetId?: string;
    action?: () => void;
  }>({
    isOpen: false,
    type: "warning",
    title: "",
    description: "",
    targetId: ""
  });

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const triggerModal = (type: "delete" | "warning" | "success", title: string, description: string, action?: () => void) => {
    setCustomModal({ isOpen: true, type, title, description, action });
  };

  const closeModal = () => {
    setCustomModal({ isOpen: false, type: "warning", title: "", description: "" });
  };

  const handleSubmit = async () => {
    if (!title || !message || !expiryDate) {
      triggerModal("warning", "Missing Fields", "Please populate all fields, including the operational auto-expiry parameter matrix.");
      return;
    }

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, expiryDate }),
      });

      if (res.ok) {
        setTitle("");
        setMessage("");
        setExpiryDate(""); 
        loadNotifications();
        
        // 🎉 SUCCESS POP-UP TRIGGERED HERE
        triggerModal(
          "success", 
          "Announcement  Published", 
          "Your announcement has been successfully Published"
        );
      } else {
        triggerModal("warning", "Pipeline Failure", "The localized server network rejected the structural configuration mapping bundle.");
      }
    } catch (error) {
      console.error(error);
      triggerModal("warning", "System Exception", "An unexpected operational instance error occurred during submission.");
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadNotifications();
        // 🎉 SUCCESS POP-UP FOR DELETION
        triggerModal("success", "Data Purged", "The notification record has been successfully erased from the database.");
      } else {
        triggerModal("warning", "Purge Aborted", "The storage engine could not execute clean-up instructions on the requested record node.");
      }
    } catch (error) {
      console.error(error);
      triggerModal("warning", "Execution Failure", "Database interaction layer dropped unexpectedly during document removal.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans p-4 md:p-8 relative">
      
      {/* 🔮 PREMIUM SYSTEM POP-UP MODAL LAYER */}
      {customModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 transform scale-100 transition-all duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${
                  customModal.type === 'delete' ? 'bg-rose-50 text-rose-600' : 
                  customModal.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {customModal.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                </div>
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-800">{customModal.title}</h3>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition">
                <X size={16} />
              </button>
            </div>

            {/* Modal Description Body */}
            <div className="space-y-3 my-4">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {customModal.description}
              </p>
              {customModal.type === "delete" && (
                <div className="p-3 bg-rose-50/80 border border-rose-100 rounded-xl text-[11px] text-rose-800 font-medium leading-normal">
                  ⚠️ Alert: Proceeding removes this entry entirely from active student portals immediately.
                </div>
              )}
            </div>

            {/* Interactive Action Triggers */}
            <div className={`${customModal.type === "delete" ? "grid grid-cols-2" : "flex justify-end"} gap-3 mt-6`}>
              {customModal.type === "delete" ? (
                <>
                  <button
                    onClick={closeModal}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition"
                  >
                    Cancel, Keep Log
                  </button>
                  <button
                    onClick={customModal.action}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} /> Confirm Wipe
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className={`text-white text-xs font-bold py-3 px-6 rounded-xl transition shadow-lg w-full sm:w-auto ${
                    customModal.type === 'success' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  }`}
                >
                  Great, Got it!
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 🔮 INTERACTIVE BANNER DESK */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold w-fit backdrop-blur-sm mb-3">
            <Sparkles size={14} className="text-amber-400" /> Admin Notice Desk
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            School Announcements
          </h1>
          <p className="mt-1.5 text-sm text-slate-300 max-w-xl font-medium">
           Create new notices, share circulars, and manage active announcements for students and staff.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 mt-8 items-start">
        
        {/* 📑 DISPATCH FORM LAYOUT */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <PlusCircle size={18} className="text-indigo-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">CREATE NEW NOTICE</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Notice Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Board Registration Syllabus 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={expiryDate}
                  min={new Date().toISOString().split("T")[0]} 
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
               Notice Description
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type guidelines, reporting time slots, or sequences directly here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2"
            >
              <Send size={14} /> Publish 
            </button>
          </div>
        </div>

        {/* 📜 DISPATCH LOG CLUSTER CONTAINER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-slate-400" />
              <div>
                <h2 className="text-base font-extrabold text-slate-900 leading-none">Active Notices</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-1">List of all live notices currently visible to users.</p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2.5 py-1 rounded-md">
              Active: {notifications.length}
            </span>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Polling Stream Cache...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No announcements posted yet</p>
              </div>
            ) : (
              [...notifications].reverse().map((item: any) => {
                const isExpired = item.expiryDate ? new Date(item.expiryDate) < new Date() : false;

                return (
                  <div
                    key={item.id}
                    className={`border rounded-2xl p-4 transition-all duration-200 ${
                      isExpired 
                        ? "bg-slate-50/60 border-slate-200/50 opacity-65" 
                        : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900 leading-tight">
                            {item.title}
                          </h3>
                          {isExpired ? (
                            <span className="text-[9px] bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                              Purged / Expired
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                              Live Stream
                            </span>
                          )}
                        </div>

                        <ExpandableMessage text={item.message} />

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] font-semibold text-slate-400">
                          <span>Pub: {new Date(item.createdAt).toLocaleDateString()}</span>
                          {item.expiryDate && (
                            <span className={`flex items-center gap-1 ${isExpired ? "text-rose-500" : "text-amber-600"}`}>
                              <Calendar size={12} /> Exp: {new Date(item.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => triggerModal(
                          "delete", 
                          "Confirm Erasure", 
                          `Are you completely sure you want to delete notification "${item.title}"?`,
                          () => executeDelete(item.id)
                        )}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition duration-150 shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}