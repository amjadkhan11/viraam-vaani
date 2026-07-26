"use client";

import { useState, useEffect } from "react";
import { 
  Phone, 
  Trash2, 
  User, 
  Mail, 
  MapPin, 
  Eye,
  Layers,
  Sparkles,
  Search,
  School,
  GraduationCap,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Download // ✅ Naya icon download ke liye
} from "lucide-react";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  // FIX: Default me "All" rakha hai taaki login karte hi saare new admissions saamne dikhein
  const [selectedClass, setSelectedClass] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Right side details sheet selection object
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // 🚨 CUSTOM BEAUTIFUL POP-UP MODAL STATE
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    studentId: string;
    studentName: string;
  }>({
    isOpen: false,
    studentId: "",
    studentName: ""
  });

  const classes = [
    "All", "Class 1", "Class 2", "Class 3", "Class 4", 
    "Class 5", "Class 6", "Class 7", "Class 8", 
    "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  // ✅ READ / GET DATABASE HOOK
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admissions", {
        cache: "no-store",
      });
      const data = await res.json();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch data exception error:", error);
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // 🚨 TRIGGER MODERN POP-UP
  const openDeleteModal = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stops parent card drawer from sliding trigger
    setDeleteModal({
      isOpen: true,
      studentId: id,
      studentName: name
    });
  };

  // 🗑️ REAL LIVE SYSTEM TRASH / CONFIRMED DELETE EXECUTOR (LINKED TO PRISMA DB ROUTE)
  const executeDelete = async () => {
    const targetId = deleteModal.studentId;
    try {
      const response = await fetch(`/api/admissions?id=${targetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Database failed to clear record.");
      }

      setAdmissions((prev) => prev.filter((item) => item.id !== targetId));
      
      if (selectedStudent?.id === targetId) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error("Deletion execution failure:", err);
      alert("Database error: Session instance couldn't be purged.");
    } finally {
      setDeleteModal({ isOpen: false, studentId: "", studentName: "" });
    }
  };

  // 📥 EXCEL / CSV DATA BACKUP DOWNLOADER
  const downloadExcel = () => {
    if (admissions.length === 0) {
      alert("Download karne ke liye koi data nahi mila!");
      return;
    }

    // Excel Sheet Headers
    const headers = ["Student Name", "Mobile Number", "Email Address", "Class Profile"];

    // Bacchon ke data ko arrays me convert karna aur double quotes block handles lagana
    const csvRows = admissions.map((student) => [
      `"${(student.name || "").replace(/"/g, '""')}"`,
      `"${student.mobile || "N/A"}"`,
      `"${student.email || "N/A"}"`,
      `"${student.className || "N/A"}"`
    ]);

    // CSV structure build up layout string
    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");

    // Excel support UTF-8 BOM add tags
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Auto virtual click setup for files downloading parameters
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ViraamVaani_Admissions_Backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ CONDUIT ROW FILTERING (FIXED: Handles "All" condition seamlessly)
  const filteredStudents = admissions.filter((student) => {
    const matchesClass = selectedClass === "All" || student?.className === selectedClass;
    const matchesSearch = 
      student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student?.mobile?.includes(searchQuery) ||
      student?.className?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans p-4 md:p-8 relative">
      
      {/* 🔮 BEAUTIFUL CUSTOM POP-UP MODAL LAYER */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 transform scale-100 transition-all duration-300 animate-scaleUp">
            
            {/* Pop-up Header Icon */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="p-2 bg-rose-50 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-800">Delete Admission Record</h3>
              </div>
              <button 
                onClick={() => setDeleteModal({ isOpen: false, studentId: "", studentName: "" })}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Pop-up Core Warning Text */}
            <div className="space-y-3 my-4">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to permanently delete <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">“{deleteModal.studentName}”</span> from this active academic session?
              </p>
              <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-[11px] text-amber-800 font-medium leading-normal">
                ⚠️ Warning: This administrative action is permanent and cannot be undone. All This will permanently remove the student's admission data from the database.
              </div>
            </div>

            {/* Pop-up Interactive Action Controls */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setDeleteModal({ isOpen: false, studentId: "", studentName: "" })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Confirm Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔮 HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold w-fit backdrop-blur-sm mb-3">
            <Sparkles size={14} className="text-amber-400" /> Active Session Records Desk
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Student Admission Record
          </h1>
          <p className="mt-1.5 text-sm text-slate-300 max-w-xl font-medium">
            “View, manage, and download student admission form data for the current academic session.”
          </p>
        </div>
      </div>

      {/* 📥 EXCEL DATA BACKUP CONTROL ROW (ADDED NEW FEATURE) */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">Download Admission Data</h3>
          <p className="text-xs text-slate-400">Download the complete Excel sheet of all registered student admission forms before managing records.</p>
        </div>
        <button
          onClick={downloadExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-3 rounded-xl flex items-center gap-2 transition shadow-md shadow-emerald-600/20 uppercase tracking-wider w-full sm:w-auto justify-center"
        >
          <Download size={15} /> Download  Excel Sheet
        </button>
      </div>

      {/* 🗂️ CLASS PROFILES */}
      <div className="mt-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers size={14} /> Class Profiles
        </h2>
        <div className="flex flex-wrap gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/60 shadow-sm">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setSelectedStudent(null);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                selectedClass === cls
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cls === "All" ? "✨ All Classes" : cls}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 WORKSPACE DASHBOARD MATRIX GRID */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8 items-start">
        
        {/* MANAGEMENT LOG DATA ROW */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 lg:col-span-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                {selectedClass === "All" ? "Admission Forms Data" : `Admission Forms Data (${selectedClass})`}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Select a student application to view full admission details.</p>
            </div>

            {/* Query Search Panel Input */}
            <div className="relative max-w-xs w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search name, phone, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-rose-600/20 border-t-rose-600 rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Admissions...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-sm font-semibold text-slate-400">No admission records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...filteredStudents].reverse().map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`border rounded-2xl p-4 transition-all duration-200 cursor-pointer ${
                    selectedStudent?.id === student.id
                      ? "border-rose-500 bg-rose-50/10 ring-1 ring-rose-500/20" 
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {student.name ? student.name.charAt(0).toUpperCase() : <User size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {student.name}
                          </h3>
                          <span className="text-[10px] font-black tracking-wide text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                            {student.className || "Unknown Class"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Father: <span className="text-slate-600 font-medium">{student.fatherName || "N/A"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg font-medium">
                        <Phone size={13} className="text-slate-400" /> {student.mobile || "N/A"}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => openDeleteModal(student.id, student.name, e)}
                          className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition duration-150 flex items-center gap-1.5 text-xs font-bold"
                          title="Delete Record"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl lg:hidden">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🗚 DETAILED META AUDIT PANEL */}
        <div className="lg:col-span-1 sticky top-6">
          {selectedStudent ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md transition-all duration-300">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-indigo-600" /> Admission Details
                </h3>
                <button 
                  onClick={() => setSelectedStudent(null)} 
                  className="text-xs text-slate-400 hover:text-slate-900 bg-slate-50 px-2.5 py-1 rounded-md font-bold"
                >
                  Close
                </button>
              </div>

              {/* Avatar Frame */}
              <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl p-4 border border-slate-100 text-center mb-5">
                <div className="w-12 h-12 bg-slate-900 text-white font-black text-base flex items-center justify-center rounded-2xl mx-auto shadow-md">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-base font-black text-slate-900 mt-2.5 leading-none">{selectedStudent.name}</h4>
                <p className="text-xs text-slate-500 font-bold mt-2 px-3 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full inline-block">
                  {selectedStudent.className || "Dynamic"} Student Profile
                </p>
              </div>

              {/* DYNAMIC REGISTRATION FIELD MAPPING */}
              <div className="space-y-4 text-xs">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Student Name</label>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/40 text-slate-800 font-bold flex items-center gap-2">
                    <User size={14} className="text-slate-400" /> {selectedStudent.name}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Father's Name</label>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/40 text-slate-700 font-semibold">
                    👨‍👦 {selectedStudent.fatherName || "Not Provided"}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Mobile Number</label>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/40 text-slate-700 flex items-center gap-2 font-mono font-bold">
                    <Phone size={14} className="text-slate-400" /> {selectedStudent.mobile || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/40 text-slate-600 flex items-center gap-2 font-medium break-all">
                    <Mail size={14} className="text-slate-400" /> {selectedStudent.email || "No Email Registered"}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Class Applied For</label>
                  <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 text-indigo-950 font-black flex items-center gap-2">
                    <GraduationCap size={14} className="text-indigo-500" /> {selectedStudent.className}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current School Name</label>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/40 text-slate-700 flex items-center gap-2 font-medium">
                    <School size={14} className="text-slate-400" /> {selectedStudent.schoolName || "Not Mentioned"}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Permanent Address</label>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/40 text-slate-600 leading-relaxed font-medium flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" /> 
                    <span>{selectedStudent.address || "Address not provided."}</span>
                  </div>
                </div>

              </div>

              {/* Master Destructive Flush Execution Button Controls */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={(e) => openDeleteModal(selectedStudent.id, selectedStudent.name, e)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition text-xs shadow-md shadow-rose-600/10"
                >
                  <Trash2 size={15} /> Delete Admission Form
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400">
              <User className="mx-auto mb-2 opacity-40" size={28} />
              <p className="text-xs font-bold uppercase tracking-wider">No Student Selected</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Select a student application to view full admission details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}