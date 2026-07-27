"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  FileText,
  Download,
  BookOpen,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";

export default function StudyMaterialPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedClass, setSelectedClass] = useState("All");
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      
      fetch("/api/materials")
        .then((res) => res.json())
        .then((data) => setMaterials(data))
        .catch((err) => console.error(err));
    }
  }, [router]);

  const filteredMaterials = selectedClass === "All" 
    ? materials 
    : materials.filter((item) => item.className === selectedClass);

  const getClassMaterialCount = (className: string) => {
    return materials.filter((item) => item.className === className).length;
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // 1. Cloudinary URL ko force-download mode me convert karo
      let cleanUrl = fileUrl;
      if (fileUrl.includes("cloudinary.com") && fileUrl.includes("/upload/")) {
        cleanUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
      }

      // 2. Fetch call with clean headers (taaki website ka auth token Cloudinary par na jaye)
      const response = await fetch(cleanUrl, {
        method: "GET",
        mode: "cors",
        headers: new Headers({
          "Accept": "application/pdf"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName.replace(/\s+/g, "_")}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error, trying fallback:", error);
      
      // Fallback: Agar kisi wajah se CORS ya 401 block kare, 
      // toh new tab me direct Cloudinary attachment open kar do, ye download start kar dega
      let fallbackUrl = fileUrl;
      if (fileUrl.includes("cloudinary.com") && fileUrl.includes("/upload/")) {
        fallbackUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
      }
      window.open(fallbackUrl, "_blank");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-900" size={40} />
        <p className="text-slate-600 font-medium text-sm">Checking access permission...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mini Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Study Material</h1>
            <p className="text-blue-200 text-xs md:text-sm mt-1">Access notes, assignments, and practice papers seamlessly.</p>
          </div>
          <div className="bg-blue-900/50 border border-blue-700/50 rounded-xl px-4 py-2 text-xs md:text-sm inline-flex items-center gap-2 self-start md:self-auto backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Total {materials.length} Resources Active
          </div>
        </div>
      </section>

      {/* Compact Class Filter Chips */}
      <section className="py-6 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <SlidersHorizontal size={14} className="text-blue-900" />
            <span>Quick Filter</span>
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* "All" chip */}
            <button
              onClick={() => setSelectedClass("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedClass === "All"
                  ? "bg-blue-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Classes ({materials.length})
            </button>

            {/* Class chips */}
            {[...Array(12)].map((_, i) => {
              const cls = `Class ${i + 1}`;
              const count = getClassMaterialCount(cls);
              const hasMaterial = count > 0;

              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    selectedClass === cls
                      ? "bg-blue-950 text-white shadow-sm font-bold"
                      : hasMaterial
                      ? "bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100"
                      : "bg-slate-50 text-slate-400 border border-slate-200/60 opacity-65 hover:opacity-100"
                  }`}
                >
                  <span>{cls}</span>
                  {hasMaterial && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedClass === cls ? "bg-blue-800 text-white" : "bg-blue-900 text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Materials Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-blue-900" size={20} />
          <h2 className="text-xl font-bold text-slate-950">
            {selectedClass === "All" ? "Latest Material" : `${selectedClass} Resources`}
          </h2>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200 max-w-md mx-auto mt-4">
            <h3 className="font-semibold text-slate-700 text-base">No content here yet</h3>
            <p className="text-slate-400 mt-1 text-xs">
              📚 Documents for this class haven&apos;t been uploaded. Try choosing a class with an active tag!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((pdf, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-900/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    {/* Subject Tag - Clean Royal Blue Badge */}
                    <span className="text-[10px] bg-blue-50 text-blue-900 border border-blue-200/80 px-2.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider">
                      {pdf.subject}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                      {pdf.className}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-bold text-slate-950 line-clamp-1 flex items-center gap-2">
                      <FileText size={16} className="text-blue-900 flex-shrink-0" />
                      {pdf.title}
                    </h3>
                    <p className="mt-1 text-slate-500 text-xs line-clamp-2">
                      {pdf.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(pdf.pdfUrl, pdf.title)}
                  className="mt-4 w-full bg-slate-950 hover:bg-blue-900 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Download size={14} />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}