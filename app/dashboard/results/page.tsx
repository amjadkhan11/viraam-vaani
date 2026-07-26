"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { domToCanvas } from "modern-screenshot";
import { Download } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    const input = document.getElementById("result-pdf");
    if (!input || !data) return;

    try {
      const canvas = await domToCanvas(input, {
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.studentName}-${data.examName || "Result"}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("PDF download karne me dikkat aayi!");
    }
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Please login first");
          return;
        }

        const user = JSON.parse(storedUser);
        if (!user.email) {
          setError("Email not found");
          return;
        }

        const res = await fetch(`/api/results?email=${encodeURIComponent(user.email)}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Result not found");
        } else {
          setData(json);
        }
      } catch (error) {
        console.error(error);
        setError("Something went wrong ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 animate-pulse flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white h-[800px] rounded-2xl shadow-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white border p-8 rounded-2xl text-center shadow-md max-w-sm w-full">
          <h2 className="text-xl font-bold text-red-600">{error}</h2>
          <Link href="/" className="inline-block mt-4 bg-blue-950 text-white px-5 py-2 rounded-xl text-sm font-semibold">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Safe parsing loop for percentage to prevent application crashes
  const displayPercentage = (() => {
    if (!data || data.percentage === undefined || data.percentage === null) return "0.00";
    const num = Number(data.percentage);
    return isNaN(num) ? String(data.percentage) : num.toFixed(2);
  })();

  return (
    <div className="min-h-screen bg-slate-200 py-6 px-4 font-serif">
      
      {/* 🟢 ACTION BAR - Download Button */}
      <div className="max-w-[800px] mx-auto mb-6 flex justify-end items-center bg-white p-4 rounded-xl shadow-sm font-sans relative z-30">
        <button 
          onClick={handleDownload} 
          className="w-full sm:w-auto bg-blue-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-sm"
        >
          <Download size={16} /> Download Report Card
        </button>
      </div>

      {/* 📱 PERFECT MOBILE VIEW WITH CONTROLLED SCROLL */}
      <div className="w-full max-w-[800px] mx-auto overflow-x-auto rounded-xl shadow-xl bg-white border border-slate-300 no-scrollbar">
        <div className="min-w-[800px] bg-white">
          
          {/* 📄 REPORT CARD CANVAS */}
          <div 
            id="result-pdf" 
            className="w-[800px] p-12 relative overflow-hidden flex flex-col justify-between bg-white select-none mx-auto"
            style={{ minHeight: "1120px" }}
          >
            
            <div>
              {/* TOP DESIGN HEADER */}
              <div className="relative flex justify-between items-start -mt-12 -mx-12 h-52 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 overflow-hidden">
                
                {/* 🎯 LOGO AREA */}
                <div className="absolute top-6 left-10 w-40 h-40 bg-white rounded-full border-4 border-[#3b82f6] flex items-center justify-center shadow-md z-20 overflow-hidden">
                  <img 
                    src="/images/logo.jpeg" 
                    alt="Viraam Vaani Official Logo" 
                    className="w-[92%] h-[92%] object-cover object-center mix-blend-multiply scale-[1.12]"
                  />
                </div>

                {/* Blue Decorative Accent Line */}
                <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-500 transform -skew-y-3 origin-bottom-left z-10"></div>

                {/* Right Headings */}
                <div className="absolute right-12 top-10 text-right z-20 font-sans">
                  <h2 className="text-3xl font-black tracking-widest text-slate-300 uppercase font-serif">VIRAAM VAANI</h2>
                  <h3 className="text-2xl font-extrabold text-white mt-1 tracking-wide uppercase">STUDENT REPORT CARD</h3>
                </div>
              </div>

              {/* DYNAMIC STUDENT INFO FIELDS */}
              <div className="mt-12 grid grid-cols-2 gap-y-6 gap-x-12 text-sm text-slate-800 border-b border-slate-200 pb-8">
                <div className="flex items-end gap-2">
                  <span className="font-bold whitespace-nowrap">Student Name:</span>
                  <span className="border-b border-slate-400 flex-1 pb-0.5 font-medium px-2 text-slate-900">{data.studentName}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-bold whitespace-nowrap">Father Name:</span>
                  <span className="border-b border-slate-400 flex-1 pb-0.5 font-medium px-2 text-slate-900">{data.fatherName || "N/A"}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-bold whitespace-nowrap">Roll Number:</span>
                  <span className="border-b border-slate-400 flex-1 pb-0.5 font-medium px-2 font-sans text-slate-900">{data.rollNumber}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-bold whitespace-nowrap">Class / Grade:</span>
                  <span className="border-b border-slate-400 flex-1 pb-0.5 font-medium px-2 text-slate-900">{data.className}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-bold whitespace-nowrap">Exam Name:</span>
                  <span className="border-b border-slate-400 flex-1 pb-0.5 font-medium px-2 text-slate-900">{data.examName || "Term End Examination"}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-bold whitespace-nowrap">Session:</span>
                  <span className="border-b border-slate-400 flex-1 pb-0.5 font-medium px-2 font-sans text-slate-900">{data.session || "2026-27"}</span>
                </div>
              </div>

              {/* MAIN SUBJECT MARKS TABLE */}
              <div className="mt-8 border border-slate-600 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-700 text-white text-xs uppercase tracking-wider font-bold border-b border-slate-600">
                      <th className="p-3 border-r border-slate-600 w-[28%]">Subject</th>
                      <th className="p-3 text-center border-r border-slate-600 w-[18%]">Objective Marks</th>
                      <th className="p-3 text-center border-r border-slate-600 w-[18%]">Subjective Marks</th>
                      <th className="p-3 text-center border-r border-slate-600 w-[18%]">Total Score</th>
                      <th className="p-3 text-center w-[18%]">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-sm">
                    {data.subjects?.map((s: any, i: number) => (
                      <tr key={i} className="bg-white">
                        <td className="p-3 font-semibold border-r border-slate-300 text-slate-900">{s.subject}</td>
                        {/* Swapped order dynamically according to client report layouts */}
                        <td className="p-3 text-center border-r border-slate-300 font-sans text-slate-600">{s.objective || 0}</td>
                        <td className="p-3 text-center border-r border-slate-300 font-sans text-slate-600">{s.subjective || 0}</td>
                        <td className="p-3 text-center border-r border-slate-300 font-bold text-slate-900 bg-slate-50/30 font-sans">
                          {Number(s.objective || 0) + Number(s.subjective || 0)}
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-950 bg-slate-50 font-sans">{s.maxMarks || 100}</td>
                      </tr>
                    ))}
                    
                    {/* GRAND SUMMARY ROW */}
                    <tr className="bg-slate-100 border-t-2 border-slate-600 font-bold text-slate-900 text-sm">
                      <td colSpan={3} className="p-3 border-r border-slate-300 uppercase tracking-wider text-slate-700">Grand Summary</td>
                      <td className="p-3 text-center border-r border-slate-300 text-base font-sans font-black bg-slate-200/50">
                        {data.totalMarksObtained || data.totalMarks || 0}
                      </td>
                      <td className="p-3 text-center text-base font-sans font-black bg-indigo-50 text-indigo-950">
                        {data.totalMaxMarksPool || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ANALYTICS SECTION */}
{/* PERFORMANCE ANALYTICS */}
<div className="mt-8 border border-slate-600 rounded-md overflow-hidden shadow-sm">
  <table className="w-full border-collapse text-sm">
    <thead>
      <tr className="bg-slate-700 text-white">
        <th
          colSpan={4}
          className="px-4 py-3 text-left uppercase tracking-widest text-xs font-bold"
        >
          Performance Analytics
        </th>
      </tr>
    </thead>

    <tbody>
      <tr className="even:bg-slate-50">
        <td className="w-1/4 border border-slate-300 px-4 py-3 font-semibold text-slate-700">
          Class Rank
        </td>

        <td className="border border-slate-300 px-4 py-3 text-center font-black text-lg text-blue-700">
          {data.classRank || data.rank || "N/A"}
        </td>

        <td className="w-1/4 border border-slate-300 px-4 py-3 font-semibold text-slate-700">
          Percentage
        </td>

        <td className="border border-slate-300 px-4 py-3 text-center font-black text-lg text-emerald-700">
          {displayPercentage}%
        </td>
      </tr>

      <tr className="bg-slate-50">
        <td className="border border-slate-300 px-4 py-3 font-semibold text-slate-700">
          Division
        </td>

        <td className="border border-slate-300 px-4 py-3 text-center font-bold text-indigo-700">
          {data.divisionStatus || "N/A"}
        </td>

        <td className="border border-slate-300 px-4 py-3 font-semibold text-slate-700">
          Result
        </td>

        <td
          className={`border border-slate-300 px-4 py-3 text-center font-black tracking-wide ${
            data.resultStatus === "FAILED"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {data.resultStatus || "PASSED"}
        </td>
      </tr>

      <tr>
        <td className="border border-slate-300 px-4 py-3 font-semibold text-slate-700">
          Remarks
        </td>

        <td
          colSpan={3}
          className="border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800"
        >
          {data.performanceRemarks || data.remark || "Excellent Performance"}
        </td>
      </tr>
    </tbody>
  </table>
</div>
            </div>

            {/* SIGNATURES & FOOTER SECTION */}
            <div className="mt-20">
  <div className="grid grid-cols-2 gap-20 text-center text-xs font-bold text-slate-700">
    <div>
      <div className="w-full border-b border-slate-400 mb-2"></div>
      <p>Class Teacher Signature</p>
    </div>

    <div>
      <div className="w-full border-b border-slate-400 mb-2"></div>
      <p>Parent's Signature</p>
    </div>
  </div>

  <p className="text-center text-[10px] text-slate-400 font-sans tracking-tight mt-12">
    Viraam Vaani Classes | Official Academic Record | System Generated Document
  </p>
</div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}