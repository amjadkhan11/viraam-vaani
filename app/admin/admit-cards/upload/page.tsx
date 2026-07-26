"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function BulkUploadAdmitCards() {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  // 📄 1. Sample Excel file download karne ka function
  const downloadSampleExcel = () => {
    const sampleData = [
      {
        studentName: "Amjad",
        rollNumber: "VV2026001",
        registrationNo: "REG12345",
        parentName: "Suresh Kumar",
        dob: "15-08-2005",
        batch: "NEET Dropper 2026",
        email: "rahul@gmail.com",
        examName: "Monthly Mock Test - 1",
        examDate: "26-07-2026",
        examDay: "Sunday",
        examTime: "10:00 AM - 01:00 PM",
        reportingTime: "09:30 AM",
        duration: "3 Hours",
        centerName: "Viraam Vaani Main Campus",
        centerAddress: "123, Edu Tower, Near Metro Station, Delhi",
        roomNo: "102",
        seatNo: "A-12"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AdmitCardsTemplate");
    XLSX.writeFile(workbook, "Admit_Card_Bulk_Template.xlsx");
  };

  // 🧪 2. Excel File processing function
  const handleFileProcessing = (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls") && !file.name.endsWith(".csv")) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please upload a valid Excel or CSV file only.",
        customClass: { popup: "rounded-3xl bg-white text-slate-900 border-2 border-amber-500" }
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          throw new Error("Excel file is empty!");
        }

        // Validate essential fields
        const missingFields = ["studentName", "rollNumber", "email", "examName", "examDate", "centerName"].filter(
          (field) => !json[0].hasOwnProperty(field)
        );

        if (missingFields.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Column Mismatch",
            text: `Required headers are missing: ${missingFields.join(", ")}. Download the template for correct headers.`,
            customClass: { popup: "rounded-3xl bg-white text-slate-900 border-2 border-amber-500" }
          });
          return;
        }

        setParsedData(json);
      } catch (err) {
        console.error(err);
        Swal.fire({ 
          icon: "error", 
          title: "Parsing Error", 
          text: "Could not read the excel data file.",
          customClass: { popup: "rounded-3xl bg-white text-slate-900 border-2 border-amber-500" }
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  // 🚀 3. Server API standard fetch invocation
  const handleUploadToServer = async () => {
    if (parsedData.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/admit-cards/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: parsedData }),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "SUCCESS",
          text: result.message || "All admit cards updated successfully!",
          customClass: { popup: "rounded-3xl bg-white text-slate-900 border-2 border-amber-500" }
        });
        setParsedData([]); // Reset data after success
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message || "Something went wrong.",
        customClass: { popup: "rounded-3xl bg-white text-slate-900 border-2 border-amber-500" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-900 flex flex-col justify-start items-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl border-4 border-double border-amber-600 p-6 md:p-8 shadow-xl">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[3px] border-blue-950 pb-6 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tight">
              BULK ADMIT CARD UPLOADER
            </h1>
            <p className="text-xs md:text-sm text-amber-600 font-bold uppercase tracking-wider mt-1">
              Securely push student examination records via excel sheet
            </p>
          </div>
          <button 
            onClick={downloadSampleExcel}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-xs font-black text-amber-400 tracking-widest uppercase border border-amber-500 shadow-sm transition-all shrink-0 active:scale-95"
          >
            <FileSpreadsheet size={16} className="text-amber-400" />
            Download Excel Template
          </button>
        </div>

        {/* Drop Zone */}
        {parsedData.length === 0 ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileProcessing(file);
            }}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all cursor-pointer ${
              isDragging 
                ? "border-amber-500 bg-amber-50/50 shadow-inner" 
                : "border-slate-300 bg-slate-50/50 hover:border-amber-600/50"
            }`}
          >
            <input 
              type="file" 
              id="excel-file" 
              className="hidden" 
              accept=".xlsx, .xls, .csv" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileProcessing(file);
              }}
            />
            <label htmlFor="excel-file" className="flex flex-col items-center cursor-pointer w-full text-center">
              <UploadCloud size={48} className={`mb-3 transition-colors ${isDragging ? 'text-amber-600' : 'text-blue-950'}`} />
              <p className="font-black text-sm md:text-base mb-0.5 text-blue-950 uppercase">Drag & drop your excel sheet here</p>
              <p className="text-xs text-slate-500 mb-4 font-medium">Supports .xlsx, .xls and .csv file extensions</p>
              <span className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold tracking-wide transition-all shadow-md">
                BROWSE COMPUTER
              </span>
            </label>
          </div>
        ) : (
          /* Preview Data Details */
          <div className="border border-slate-200 rounded-2xl p-4 md:p-6 bg-slate-50/50 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={20} />
                <span className="font-black text-blue-950 text-base md:text-lg uppercase tracking-tight">
                  {parsedData.length} Students Ready to Upload
                </span>
              </div>
              <button 
                onClick={() => setParsedData([])}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                disabled={loading}
              >
                Clear File
              </button>
            </div>

            {/* Quick Data View Grid */}
            <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-1 custom-scrollbar">
              {parsedData.slice(0, 5).map((student: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs p-3 bg-white rounded-xl border-l-4 border-l-blue-950 border border-slate-200 shadow-sm">
                  <div>
                    <span className="font-black text-blue-950 block uppercase">{student.studentName}</span>
                    <span className="text-slate-500 font-medium text-[11px]">Roll: <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1 rounded">{student.rollNumber}</span> • {student.email}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-black text-[10px] border border-amber-200/60 uppercase tracking-wider">
                    {student.batch}
                  </span>
                </div>
              ))}
              {parsedData.length > 5 && (
                <p className="text-center text-slate-500 text-xs italic pt-2 font-medium">
                  ...and {parsedData.length - 5} more records loaded.
                </p>
              )}
            </div>

            {/* Final Action Button */}
            <button
              onClick={handleUploadToServer}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800 font-black text-sm tracking-widest text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin text-amber-400" />
                  SAVING RECORDS TO DATABASE...
                </>
              ) : (
                <>
                  PUSH ADMIT CARDS TO LIVE SYSTEM
                </>
              )}
            </button>
          </div>
        )}

        {/* Short Note Info */}
        <div className="mt-6 flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/40 p-4 rounded-xl border border-amber-500/20">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
          <p className="leading-normal font-semibold">
            <strong className="text-amber-800 uppercase tracking-wider block mb-0.5">System Rule:</strong> Hum database mein <code className="text-blue-950 font-mono font-black bg-white border border-slate-200 px-1 py-0.5 rounded">rollNumber</code> unique key use karte hain. Agar list me existing student hoga to automatic uski data fields <strong className="text-amber-700">Overwrite (Update)</strong> ho jayengi, aur naye students bina kisi record collision ke successfully append honge.
          </p>
        </div>

      </div>
    </div>
  );
}