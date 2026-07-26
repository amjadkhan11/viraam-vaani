"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  BookOpen,
  Trash2,
  Sparkles,
  Layers,
  GraduationCap,
  CloudLightning,
  Eye,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";

// Static arrays defined outside the component to prevent Next.js hydration bugs
const CLASSES_LIST = [
  "Class 1", "Class 2", "Class 3", "Class 4", 
  "Class 5", "Class 6", "Class 7", "Class 8", 
  "Class 9", "Class 10", "Class 11", "Class 12"
];

const SUBJECTS_LIST = [
  "Mathematics", "Science", "English", "Hindi", "Social Science"
];

export default function MaterialsPage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [materials, setMaterials] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/materials");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading materials:", error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title || !selectedClass || !selectedSubject || !pdfFile) {
      Swal.fire({
        icon: "warning",
        title: "REQUIRED FIELDS MISSING",
        text: "Please fill out all the input fields and attach a PDF file.",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-3xl font-sans" }
      });
      return;
    }

    Swal.fire({
      title: "Uploading PDF...",
      text: "Please wait while your file is being saved to the server...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: { popup: "rounded-3xl font-sans" }
    });

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        Swal.fire({
          icon: "error",
          title: "UPLOAD FAILED",
          text: "The server could not upload your file. Please try again.",
          confirmButtonColor: "#ef4444",
          customClass: { popup: "rounded-3xl font-sans" }
        });
        return;
      }

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          className: selectedClass,
          subject: selectedSubject,
          fileUrl: uploadData.url,
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "UPLOADED SUCCESSFULLY",
          text: "The study material is now live and visible on student dashboards.",
          confirmButtonColor: "#4f46e5",
          timer: 2000,
          customClass: { popup: "rounded-3xl font-sans" }
        });

        setTitle("");
        setDescription("");
        setSelectedClass("");
        setSelectedSubject("");
        setPdfFile(null);
        loadMaterials();
      } else {
        Swal.fire({
          icon: "error",
          title: "DATABASE ERROR",
          text: "The file uploaded successfully, but the system failed to save the data record.",
          confirmButtonColor: "#ef4444",
          customClass: { popup: "rounded-3xl font-sans" }
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "SERVER ERROR",
        text: "An unexpected error occurred. Please check your connection and try again.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl font-sans" }
      });
    }
  };

  const handleDelete = async (id: string | number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Cancel",
      customClass: { popup: "rounded-3xl font-sans" }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/materials?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "DELETED",
              text: "The study material has been removed successfully.",
              confirmButtonColor: "#4f46e5",
              timer: 1500,
              customClass: { popup: "rounded-3xl font-sans" }
            });
            loadMaterials();
          } else {
            const errorData = await res.json();
            Swal.fire({
              icon: "error",
              title: "DELETE FAILED",
              text: errorData.error || "The server rejected the request to delete this record.",
              confirmButtonColor: "#ef4444",
              customClass: { popup: "rounded-3xl font-sans" }
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "CONNECTION ERROR",
            text: "Could not establish contact with the server.",
            confirmButtonColor: "#ef4444",
            customClass: { popup: "rounded-3xl font-sans" }
          });
        }
      }
    });
  };

  // Safe sorting to prevent modifying original state directly
  const sortedMaterials = [...materials].sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans p-4 md:p-8">
      
      {/* 🔮 TOP BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold w-fit backdrop-blur-sm mb-3">
            <Sparkles size={14} className="text-amber-400" /> Admin Control Portal
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Study Materials Manager
          </h1>
          <p className="mt-1.5 text-sm text-slate-300 max-w-xl font-medium">
            Upload new educational PDFs, configure target classes and subjects, or delete old resources seamlessly.
          </p>
        </div>
      </div>

      {/* 🏁 TWO COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-5 gap-8 mt-8 items-start">
        
        {/* 📑 UPLOAD FORM */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
            <CloudLightning size={18} className="text-indigo-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Upload New Material</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Class</label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <Layers size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subject</label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS_LIST.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <GraduationCap size={15} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1 - Introduction to Trigonometry"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a short summary or objective of this document..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 resize-none focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select PDF File</label>
              <label className="group w-full border-2 border-dashed border-slate-200 hover:border-indigo-400/60 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition duration-200">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <FileText size={24} className="text-slate-400 group-hover:text-indigo-500 transition" />
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-indigo-600 transition">
                  {pdfFile ? pdfFile.name : "Click or drop to choose a PDF file"}
                </span>
                <span className="text-[9px] font-semibold text-slate-400">Maximum file size: 10MB</span>
              </label>
            </div>

            <button
              onClick={handleUpload}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Upload size={14} /> Submit
            </button>
          </div>
        </div>

        {/* 📜 UPLOADED MATERIALS LIST */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-slate-400" />
              <div>
                <h2 className="text-base font-extrabold text-slate-900 leading-none">Active Files</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Manage currently available materials</p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2.5 py-1 rounded-md">
              TOTAL FILES: {materials.length}
            </span>
          </div>

          <div className="max-h-[550px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading Files...</p>
              </div>
            ) : sortedMaterials.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2">
                <AlertCircle size={24} className="text-slate-300" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No files uploaded yet</p>
              </div>
            ) : (
              sortedMaterials.map((item) => (
                <div
                  key={item.id || item._id}
                  className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 shadow-sm transition duration-150"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3.5 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/40 flex items-center justify-center shrink-0">
                        <FileText className="text-indigo-600" size={20} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">{item.title}</h3>
                        {item.description && (
                          <p className="text-xs text-slate-500 font-medium leading-normal line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {item.className}
                          </span>
                          <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100/30 px-2 py-0.5 rounded">
                            {item.subject}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 rounded-xl transition"
                        >
                          <Eye size={14} />
                        </a>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id || item._id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}