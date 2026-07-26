"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Modal state fields
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    // 1. Direct standard token check before hydration
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login"; // Standard redirect
      return;
    }

    // 2. Client side data injection only after safe mount
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditName(parsedUser?.name || "");
      setEditPhone(parsedUser?.phone || "");
    }
  }, []);

  // Update handler profile update protocols
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return alert("Name cannot be empty!");

    const updatedUser = {
      ...user,
      name: editName,
      phone: editPhone,
    };

    // Save synchronously inside persistent local structures
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditModalOpen(false);
  };

  // Standard redirect fallback while loading dynamic state
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <p className="text-slate-500 font-semibold">Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Light Mesh Accent Blurs (Royal Blue & Soft Gold) */}
      <div className="absolute top-0 right-1/4 h-[350px] w-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* PREMIUM MINIMALIST HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">
              My Profile
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
              Review and manage your secure Viraam Vaani student credentials.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm self-start sm:self-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c4 0 7-2 7-2s3 2 7 2a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg>
            Live Sync Active
          </div>
        </div>

        {/* HERO BRANDING PROFILE BANNER CARD */}
        <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-[2rem] p-6 md:p-8 text-white shadow-xl border border-blue-900/40 overflow-hidden">
          
          {/* Internal Geometric Decorative Accents (Pure CSS Grid) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-60" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
            
            {/* Royal Glow Avatar Wrapper */}
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 opacity-80 blur-sm group-hover:opacity-100 transition duration-300" />
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-blue-950 flex items-center justify-center text-4xl md:text-5xl font-black border-4 border-slate-950/40 shadow-inner">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
            </div>

            {/* Profile Meta Details */}
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-[10px] font-black uppercase text-amber-400 tracking-wider">
                👑 Core Student Portal Member
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white capitalize">
                {user?.name || "Student User"}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <span className="text-xs md:text-sm font-semibold text-blue-200 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  📚 Class: <span className="font-bold text-white">{user?.className || "Not Assigned"}</span>
                </span>
                <span className="text-xs md:text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  Verified Account
                </span>
              </div>
            </div>

            {/* ACTION DIRECT TRIGGER: Edit Profile Button Placed inside Hero Card for Premium Aesthetic balance */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              type="button"
              className="relative z-20 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              <div className="p_icon_edit" />
              Edit Profile
            </button>

          </div>
        </div>

        {/* TWO COLUMN GRID DETAILS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BLOCK 1: PERSONAL INFORMATION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md shadow-slate-100/40 relative overflow-hidden group hover:border-blue-900/20 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-900 to-indigo-600" />
            
            <h3 className="text-lg font-black text-slate-950 mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-900"><div className="p_icon_user"/></span>
              Personal Information
            </h3>

            <div className="divide-y divide-slate-100 space-y-4">
              
              {/* Row 1: Full Name */}
              <div className="flex items-start gap-4 pt-1">
                <div className="mt-1 p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                  <div className="p_icon_user_sm"/>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm font-extrabold text-slate-800 capitalize mt-0.5">{user?.name || "N/A"}</p>
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="flex items-start gap-4 pt-4">
                <div className="mt-1 p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                  <div className="p_icon_mail"/>
                </div>
                <div className="break-all flex-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{user?.email || "N/A"}</p>
                </div>
              </div>

              {/* Row 3: Mobile Number */}
              <a href={`tel:${user?.phone || ''}`} title="Call Student" className="flex items-start gap-4 pt-4 group transition-colors hover:bg-slate-50 rounded-xl p-2 -ml-2">
                <div className="mt-1 p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors flex-shrink-0">
                  <div className="p_icon_phone"/>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-wide">Mobile Number</p>
                    {user?.phone && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">Active</span>
                    )}
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 group-hover:text-blue-900 transition-colors tracking-wide mt-0.5 break-all">{user?.phone || "N/A"}</p>
                </div>
              </a>

            </div>
          </div>

          {/* BLOCK 2: ACADEMIC DETAILS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md shadow-slate-100/40 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400" />
            
            <h3 className="text-lg font-black text-slate-950 mb-5 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><div className="p_icon_gradcap"/></span>
              Academic Credentials
            </h3>

            <div className="divide-y divide-slate-100 space-y-4">
              
              {/* Row 1: Enrolled Class */}
              <div className="flex items-start gap-4 pt-1">
                <div className="mt-1 p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 flex-shrink-0">
                  <div className="p_icon_gradcap_sm"/>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Current Standard / Class</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{user?.className || "N/A"}</p>
                </div>
              </div>

              {/* Row 2: Status Indicator */}
              <div className="flex items-start gap-4 pt-4">
                <div className="mt-1 p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 flex-shrink-0">
                  <div className="p_icon_status"/>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Account Authorization</p>
                  <div className="mt-1.5">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black border border-emerald-200/60 tracking-wide inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                      ACTIVE ACCOUNT
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* WORKING DIALOG MODAL LAYOUT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-lg font-black text-slate-900">Update Profile</h4>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold bg-transparent border-none outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Mobile Number</label>
                <input 
                  type="text" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer border-none outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-900/10 hover:opacity-95 transition-all cursor-pointer border-none outline-none"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Internal PURE CSS ICONS DEFINITION */}
      <style jsx global>{`
        .p_icon_user {
          width: 16px; height: 16px; border-radius: 50%; border: 1.8px solid currentColor; position: relative;
        }
        .p_icon_user::after {
          content: ''; position: absolute; bottom: -7px; left: 50%; transform: translateX(-50%); width: 22px; height: 10px; border-radius: 10px 10px 0 0; border: 1.8px solid currentColor; border-bottom: none;
        }
        .p_icon_user_sm {
          width: 14px; height: 14px; border-radius: 50%; border: 1.6px solid currentColor; position: relative;
        }
        .p_icon_user_sm::after {
          content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 18px; height: 8px; border-radius: 8px 8px 0 0; border: 1.6px solid currentColor; border-bottom: none;
        }
        .p_icon_mail {
          width: 16px; height: 12px; border: 1.8px solid currentColor; border-radius: 1px; position: relative;
        }
        .p_icon_mail::after {
          content: ''; position: absolute; top: 0px; left: 1px; width: 10px; height: 5px; border: 1.8px solid currentColor; border-top: none; border-radius: 0 0 2px 2px; transform: translateY(-10%);
        }
        .p_icon_phone {
          width: 16px; height: 16px; position: relative; color: currentColor;
        }
        .p_icon_phone::after {
          content: ''; display: block; width: 11px; height: 12px; border: 1.8px solid currentColor; border-radius: 2.5px 2px 2px 8px; transform: rotate(-10deg) skewX(-15deg); position: absolute; top: 50%; left: 50%; transform-origin: center; margin-top: -6px; margin-left: -5.5px;
        }
        .p_icon_gradcap {
          width: 16px; height: 16px; position: relative; color: currentColor;
        }
        .p_icon_gradcap::before {
          content: ''; position: absolute; top: -1px; left: 50%; transform: translateX(-50%) rotate(-45deg); width: 14px; height: 14px; background: currentColor; border-radius: 2px;
        }
        .p_icon_gradcap::after {
          content: ''; position: absolute; bottom: 0px; left: 50%; transform: translateX(-50%); width: 14px; height: 11px; border-radius: 50% 50% 0 0; border: 1.8px solid currentColor; border-bottom: none;
        }
        .p_icon_gradcap_sm {
          width: 14px; height: 14px; position: relative; color: currentColor;
        }
        .p_icon_gradcap_sm::before {
          content: ''; position: absolute; top: -1px; left: 50%; transform: translateX(-50%) rotate(-45deg); width: 12px; height: 12px; background: currentColor; border-radius: 2px;
        }
        .p_icon_gradcap_sm::after {
          content: ''; position: absolute; bottom: 0px; left: 50%; transform: translateX(-50%); width: 12px; height: 9px; border-radius: 50% 50% 0 0; border: 1.6px solid currentColor; border-bottom: none;
        }
        .p_icon_status {
          width: 16px; height: 16px; position: relative; color: currentColor;
        }
        .p_icon_status::after {
          content: ''; display: block; width: 13px; height: 14px; border: 1.8px solid currentColor; border-radius: 3px 3px 50% 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .p_icon_status::before {
          content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 8px; font-weight: 900;
        }
        .p_icon_edit {
          width: 12px; height: 12px; position: relative; color: currentColor;
        }
        .p_icon_edit::after {
          content: ''; display: block; width: 4px; height: 11px; border: 1.5px solid currentColor; border-radius: 1px; transform: rotate(45deg); position: absolute; top: 1px; left: 3px;
        }
      `}</style>
    </div>
  );
}