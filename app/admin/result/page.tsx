"use client";

import { useState } from "react";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  User, 
  Layers, 
  Send, 
  FileCheck2,
  Percent,
  Award,
  MessageSquare,
  UploadCloud,
  Eye,
   X,
  Calendar,
  GraduationCap
} from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function ResultsPage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [examName, setExamName] = useState("");
  const [session, setSession] = useState("2026-27");
  
  const [classRank, setClassRank] = useState("");
  const [performanceRemarks, setPerformanceRemarks] = useState("");

  const [subjects, setSubjects] = useState([
    { subject: "", objective: "", subjective: "", maxMarks: "100" },
  ]);
  
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelClass, setExcelClass] = useState("");
  const [excelExamName, setExcelExamName] = useState("");
  const [excelSession, setExcelSession] = useState("2026-27");

  const addSubject = () => {
    setSubjects([...subjects, { subject: "", objective: "", subjective: "", maxMarks: "100" }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length === 1) {
      Swal.fire({
        icon: "info",
        title: "Action Not Allowed",
        text: "At least one subject is required to save the result.",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-3xl font-sans" }
      });
      return;
    }
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const totalMarksObtained = subjects.reduce(
    (sum, item) => sum + Number(item.objective || 0) + Number(item.subjective || 0),
    0
  );

  const totalMaxMarksPool = subjects.reduce(
    (sum, item) => sum + Number(item.maxMarks || 0),
    0
  );

  const percentage = totalMaxMarksPool > 0 ? (totalMarksObtained / totalMaxMarksPool) * 100 : 0;

  const getDivisionStatus = (pct: number) => {
    if (pct < 30) return "FAIL";
    if (pct >= 30 && pct < 45) return "3rd Division";
    if (pct >= 45 && pct < 60) return "2nd Division";
    return "1st Division";
  };

  const divisionStatus = getDivisionStatus(percentage);

  // 🧠 SMART & CASE-INSENSITIVE EXCEL PARSING LOGIC (.o / .s / .O / .S)
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(sheet);

      const parsedStudents = json.map((row) => {
        const subjectsMap: { [key: string]: any } = {};
        let rowTotalObtained = 0;
        let rowTotalMax = 0;
        
        let foundRemarks = "";
        let foundRank = "";
        let foundFatherName = "";
        let foundStudentName = "";
        let foundEmail = "";
        let foundRollNumber = "";

        // Row ki har ek key (Column Header) ko scan karenge taaki spaces aur casing ka issue khatam ho sake
        Object.keys(row).forEach((key) => {
          const upperKey = key.toUpperCase().replace(/\s+/g, "").trim();
          
          // Case-insensitive aur fuzzy check Remarks ke liye
          if (
            upperKey === "PERFORMANCEREMARKS" || 
            upperKey === "PERFORMANCEREMARK" || 
            upperKey === "REMARKS" || 
            upperKey === "REMARK" ||
            upperKey.includes("REMARK")
          ) {
            foundRemarks = String(row[key] || "").trim();
          }

          // Case-insensitive aur fuzzy check Rank ke liye
          if (
            upperKey === "CLASSRANK" || 
            upperKey === "RANK" || 
            upperKey === "STUDENTRANK" ||
            upperKey.includes("RANK")
          ) {
            foundRank = String(row[key] || "").trim();
          }

          // Case-insensitive aur fuzzy check for Student Name
          if (upperKey === "STUDENTNAME" || upperKey === "NAME" || upperKey.includes("STUDENTNAME")) {
            foundStudentName = String(row[key] || "").trim();
          }

          // Case-insensitive aur fuzzy check for Father Name
          if (upperKey === "FATHERNAME" || upperKey === "FATHER" || upperKey.includes("FATHER")) {
            foundFatherName = String(row[key] || "").trim();
          }

          // Case-insensitive aur fuzzy check for Email
          if (upperKey === "EMAIL" || upperKey === "EMAILADDRESS") {
            foundEmail = String(row[key] || "").trim();
          }

          // Case-insensitive aur fuzzy check for Roll Number
          if (upperKey === "ROLLNUMBER" || upperKey === "ROLLNO" || upperKey === "ROLL") {
            foundRollNumber = String(row[key] || "").trim();
          }

          if (upperKey.endsWith(".O") || upperKey.endsWith(".S")) {
            const baseSubjectName = key.substring(0, key.lastIndexOf(".")).trim();
            const formattedSubjectName = baseSubjectName.charAt(0).toUpperCase() + baseSubjectName.slice(1);
            
            if (!subjectsMap[formattedSubjectName]) {
              subjectsMap[formattedSubjectName] = { 
                subject: formattedSubjectName, 
                objective: "0", 
                subjective: "0", 
                maxMarks: "100" 
              };
            }

            const rawValue = String(row[key] || "0");
            if (upperKey.endsWith(".O")) subjectsMap[formattedSubjectName].objective = rawValue;
            if (upperKey.endsWith(".S")) subjectsMap[formattedSubjectName].subjective = rawValue;
          }
        });

        const subjectsArray = Object.values(subjectsMap).map((sub: any) => {
          const obj = Number(sub.objective || 0);
          const subj = Number(sub.subjective || 0);
          const max = Number(sub.maxMarks || 100);

          rowTotalObtained += (obj + subj);
          rowTotalMax += max;

          return {
            ...sub,
            totalScore: obj + subj
          };
        });

        const rowPercentage = rowTotalMax > 0 ? (rowTotalObtained / rowTotalMax) * 100 : 0;
        const divStatus = getDivisionStatus(rowPercentage);

        return {
          studentName: foundStudentName || row.studentName || "",
          fatherName: foundFatherName || row.fatherName || "",
          email: foundEmail || row.email || "",
          rollNumber: foundRollNumber || row.rollNumber || "",
          classRank: foundRank || "N/A",
          performanceRemarks: foundRemarks || "Good", 
          subjects: subjectsArray,
          totalMarksObtained: rowTotalObtained,
          totalMaxMarksPool: rowTotalMax,
          percentage: rowPercentage.toFixed(2),
          divisionStatus: divStatus,
          resultStatus: divStatus === "FAIL" ? "FAILED" : "PASSED"
        };
      });

      setExcelData(parsedStudents);
      Swal.fire({
        icon: "success",
        title: "Excel File Processed",
        text: `${parsedStudents.length} student records loaded & formatted successfully.`,
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-3xl font-sans" }
      });
    };
    reader.readAsBinaryString(file);
  };

  const handleExcelPublish = async () => {
    if (!excelClass || !excelExamName || !excelSession) {
      Swal.fire({
        icon: "warning",
        title: "Missing Selection",
        text: "Please select Class, Exam Term, and Academic Session before uploading.",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-3xl font-sans" }
      });
      return;
    }
    try {
      Swal.fire({
        title: "Saving Marks Data...",
        text: "Please wait while we save the bulk results.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: { popup: "rounded-3xl font-sans" }
      });

      const res = await fetch("/api/results/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: excelData,
          className: excelClass,
          examName: excelExamName,
          session: excelSession,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Bulk Save Successful",
          text: `${data.count} student records have been upserted successfully.`,
          confirmButtonColor: "#4f46e5",
          customClass: { popup: "rounded-3xl font-sans" }
        });
        setExcelData([]);
        setExcelFile(null);
      } else {
        Swal.fire("Error", data.error, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Upload Failed", "error");
    }
  };
const downloadSampleExcel = () => {
  const sampleData = [
    {
      StudentName: "Amjad Ansari",
      FatherName: "Moharram Ansari",
      Email: "amjad@example.com",
      RollNumber: "1001",
      "Math.O": 38,
      "Math.S": 40,
      "Science.O": 35,
      "Science.S": 42,
      "English.O": 39,
      "English.S": 41,
      ClassRank: "1",
      PerformanceRemarks: "Excellent",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");

  XLSX.writeFile(workbook, "Student_Result_Sample.xlsx");
};
  const handlePublish = async () => {
    if (!studentName || !rollNumber || !selectedClass || !examName || !email || !classRank || !performanceRemarks) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Details",
        text: "Please make sure all student details, marks, rank, and remarks are filled completely.",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-3xl font-sans" }
      });
      return;
    }

    Swal.fire({
      title: "Saving Record...",
      text: "Uploading student result details to server...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { popup: "rounded-3xl font-sans" }
    });

    const subjectsWithTotalsPayload = subjects.map(item => ({
      ...item,
      totalScore: Number(item.objective || 0) + Number(item.subjective || 0)
    }));

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          fatherName,
          email,
          rollNumber,
          className: selectedClass,
          examName,
          session,
          classRank,
          performanceRemarks,
          subjects: subjectsWithTotalsPayload,
          totalMarksObtained,
          totalMaxMarksPool,
          percentage: percentage.toFixed(2),
          divisionStatus,
          resultStatus: divisionStatus === "FAIL" ? "FAILED" : "PASSED"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Result Saved Successfully",
          text: "The student marksheet report has been recorded.",
          confirmButtonColor: "#4f46e5",
          customClass: { popup: "rounded-3xl font-sans" }
        });

        setStudentName("");
        setFatherName("");
        setRollNumber("");
        setEmail("");
        setExamName("");
        setSelectedClass("");
        setClassRank("");
        setPerformanceRemarks("");
        setSubjects([{ subject: "", objective: "", subjective: "", maxMarks: "100" }]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.error || "The server rejected the current request data.",
          confirmButtonColor: "#ef4444",
          customClass: { popup: "rounded-3xl font-sans" }
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please check your internet connection.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl font-sans" }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold w-fit backdrop-blur-sm mb-3 text-indigo-200">
              <Trophy size={14} className="text-amber-400" /> Result Management
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Student Results Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* EXCEL UPLOAD SECTION */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
  <div className="flex items-center gap-2.5">
    <UploadCloud className="text-indigo-600" size={22} />
    <div>
      <h2 className="text-lg font-bold text-slate-800">
        Upload Student Marks via Excel
      </h2>
      <p className="text-xs text-slate-400">
        Upload student marks in bulk using a standard Excel sheet (.xlsx or .xls).
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={downloadSampleExcel}
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
  >
    <UploadCloud size={14} />
    Download Excel Template
  </button>
</div>
 <div className="grid md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Class</label>
            <div className="relative">
              <select
                value={excelClass}
                onChange={(e) => setExcelClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
              >
                <option value="">Select Class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                ))}
              </select>
              <Layers size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Exam Term</label>
            <div className="relative">
              <input
                type="text"
                value={excelExamName}
                onChange={(e) => setExcelExamName(e.target.value)}
                placeholder="Ex: Half Yearly / Finals"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <GraduationCap size={14} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Academic Session</label>
            <div className="relative">
              <input
                type="text"
                value={excelSession}
                onChange={(e) => setExcelSession(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <Calendar size={14} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50/50 transition relative group">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center py-2 space-y-1">
            <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition">
              Click to browse or drag & drop your Excel file here
            </span>
            <span className="text-[10px] text-slate-400">Accepts formats .xlsx, .xls exclusively</span>
          </div>
        </div>

        {excelFile && (
          <div className="mt-3 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold w-fit border border-emerald-100">
            <FileCheck2 size={14} /> Selected File: {excelFile.name}
          </div>
        )}
      </div>

      {/* 📊 DYNAMIC PREVIEW TABLE (WITH X-AXIS SCROLLBAR AND PROPER DYNAMIC WRAPPING) */}
      {excelData.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
  <div className="flex items-center gap-2">
    <Eye className="text-slate-700" size={20} />
    <h2 className="text-base font-bold text-slate-800">
      Excel Data Preview
      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs font-bold ml-1">
        {excelData.length} Students Found
      </span>
    </h2>
  </div>

  <button
    onClick={() => {
      setExcelData([]);
      setExcelFile(null);
    }}
    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition"
    title="Close Preview"
  >
   <X size={18} />
  </button>
</div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 max-h-[450px] overflow-y-auto scrollbar-thin">
            <table className="w-full min-w-[1000px] divide-y divide-slate-100 text-left text-xs table-fixed">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider sticky top-0 z-10 shadow-[inset_0_-1px_0_rgba(226,232,240,1)]">
                <tr>
                  <th className="p-3 bg-slate-50 w-[14%]">Student Name</th>
                  <th className="p-3 bg-slate-50 w-[14%]">Father / Guardian</th>
                  <th className="p-3 bg-slate-50 w-[18%]">Email</th>
                  <th className="p-3 bg-slate-50 w-[8%] text-center">Roll No.</th>
                  <th className="p-3 bg-slate-50 w-[8%] text-center">Rank</th>
                  <th className="p-3 bg-slate-50 w-[14%]">Remarks</th>
                  <th className="p-3 text-center bg-slate-50 w-[8%]">Total Score</th>
                  <th className="p-3 text-center bg-slate-50 w-[8%]">Percentage</th>
                  <th className="p-3 text-center bg-slate-50 w-[8%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium bg-white">
                {excelData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 transition">
                    <td className="p-3 font-semibold text-slate-900 truncate" title={row.studentName}>
                      {row.studentName}
                    </td>
                    <td className="p-3 text-slate-600 truncate" title={row.fatherName}>
                      {row.fatherName || "—"}
                    </td>
                    <td className="p-3 text-slate-500 break-all select-all font-mono text-[11px]">
                      {row.email || "—"}
                    </td>
                    <td className="p-3 text-center font-bold text-indigo-600">
                      {row.rollNumber}
                    </td>
                    <td className="p-3 text-center font-bold text-amber-600">
                      {row.classRank}
                    </td>
                    <td className="p-3 text-slate-600 italic truncate" title={row.performanceRemarks}>
                      "{row.performanceRemarks}"
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-700 whitespace-nowrap">
                      {row.totalMarksObtained} / {row.totalMaxMarksPool}
                    </td>
                    <td className="p-3 text-center bg-indigo-50/30 font-bold text-indigo-950">
                      {row.percentage}%
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold inline-block whitespace-nowrap ${row.resultStatus === "PASSED" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                        {row.divisionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleExcelPublish}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-indigo-600/10 flex items-center gap-2"
            >
              <Send size={14} /> Upload & Save Entire Batch
            </button>
          </div>
        </div>
      )}

      {/* MANUAL ENTRY PANEL */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Enter Student & Exam Details</h2>
            <p className="text-xs text-slate-400">Fill in the student details and exam information below to enter marks manually.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Class</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="">Choose Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                  ))}
                </select>
                <Layers size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Student Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Amjad Ansari"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <User size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Father's Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="Moharram Ansari"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Ex: 1001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold tracking-wide text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@domain.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Exam Name</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Ex: Half Yearly / Annual Exam"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Academic Session</label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Class Rank (Write manually)</label>
              <div className="relative">
                <input
                  type="text"
                  value={classRank}
                  onChange={(e) => setClassRank(e.target.value)}
                  placeholder="Ex: #1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-bold text-indigo-600 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <Award size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Performance Remarks</label>
              <div className="relative">
                <input
                  type="text"
                  value={performanceRemarks}
                  onChange={(e) => setPerformanceRemarks(e.target.value)}
                  placeholder="Ex: Excellent / Hardworking"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <MessageSquare size={14} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* SUBJECT MARKS ENTRY */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Subject Marks Entry</h3>
                <p className="text-[11px] text-slate-400 font-semibold">Enter maximum marks and marks scored for each subject</p>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition self-start sm:self-auto"
              >
                <Plus size={14} /> Add Subject
              </button>
            </div>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {subjects.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 items-center">
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={item.subject}
                      onChange={(e) => updateSubject(index, "subject", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Max"
                      value={item.maxMarks}
                      onChange={(e) => updateSubject(index, "maxMarks", e.target.value)}
                      className="w-full bg-indigo-50/40 border border-indigo-100 rounded-lg px-2 py-2 text-xs font-bold text-indigo-950 focus:outline-none focus:border-indigo-500 transition text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Obj"
                      value={item.objective}
                      onChange={(e) => updateSubject(index, "objective", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Sub"
                      value={item.subjective}
                      onChange={(e) => updateSubject(index, "subjective", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition text-center"
                    />
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-2 rounded-lg block border border-emerald-100/50 whitespace-nowrap">
                      Total: {Number(item.objective || 0) + Number(item.subjective || 0)}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY COLUMN */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50 space-y-5">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Result Summary</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Automatically calculated totals and percentage</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Marks Obtained</span>
                  <p className="text-xl font-black text-slate-900">
                    {totalMarksObtained} <span className="text-xs font-bold text-slate-400">/ {totalMaxMarksPool}</span>
                  </p>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileCheck2 size={20} />
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Percentage</span>
                  <p className="text-xl font-black text-slate-900">{percentage.toFixed(2)}%</p>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Percent size={18} />
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Division Status</span>
                  <p className="text-base font-black text-slate-900">{divisionStatus}</p>
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Trophy size={18} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              className="w-full bg-slate-900 hover:bg-indigo-950 text-white font-bold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Send size={14} /> Publish Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}