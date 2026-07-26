"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  School, 
  Phone, 
  Mail, 
  MapPin, 
  Loader2, 
  AlertTriangle, 
  Search, 
  Users, 
  FileText,
  X,
  User
} from "lucide-react";

interface SchoolRecord {
  id: string;
  schoolName: string;
  principalName?: string;
  phone?: string;
  email?: string;
  studentStrength?: number | string;
  address?: string;
  district?: string;
  state?: string;
  pincode?: string;
  reason?: string;
}

export default function SarvamRecordsAdmin() {
  const [records, setRecords] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Track selected row for Master-Detail Panel view
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sarvam");
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Database connection failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: string, schoolName: string) => {
    if (!confirm(`Are you sure you want to delete the record for "${schoolName}" permanently?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/sarvam?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecords(prev => prev.filter(item => item.id !== id));
        if (selectedId === id) setSelectedId(null);
        alert("Record permanently erased.");
      } else {
        alert("Action failed. Could not delete.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing deletion request.");
    }
  };

  const filteredRecords = records.filter(school => {
    const cleanQuery = searchTerm.trim().toLowerCase();
    return (
      school.schoolName?.toLowerCase().includes(cleanQuery) ||
      school.principalName?.toLowerCase().includes(cleanQuery)
    );
  });

  const selectedSchool = records.find(r => r.id === selectedId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col md:flex-row antialiased">
      
      {/* ─── LEFT PANEL: MASTER LIST ─── */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Admission Forms Data
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Select a student application to view full admission details.
              </p>
            </div>

            {/* Search Input Block */}
            <div className="w-full md:w-80 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5 focus-within:border-slate-400 transition-colors">
              <Search className="text-slate-400 shrink-0" size={16} />
              <input 
                type="text" 
                placeholder="Search name, phone, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-transparent outline-none placeholder-slate-400"
              />
            </div>
          </div>

          {/* Database Content Stack */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="animate-spin text-slate-800" size={32} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Loading Records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center bg-white border border-dashed p-12 rounded-2xl border-slate-200 shadow-sm">
              <AlertTriangle className="mx-auto text-amber-500 mb-2" size={26} />
              <h3 className="font-bold text-slate-700 text-sm">No Records Listed</h3>
              <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filter settings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((school) => {
                const isSelected = selectedId === school.id;
                return (
                  <div 
                    key={school.id} 
                    onClick={() => setSelectedId(school.id)}
                    className={`bg-white border rounded-xl p-4 flex items-center justify-between cursor-pointer select-none transition-all duration-150 shadow-sm ${
                      isSelected 
                        ? 'border-rose-500 ring-1 ring-rose-500/30 bg-rose-50/5' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Round Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                        {school.schoolName ? school.schoolName.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">
                            {school.schoolName}
                          </h3>
                          {school.studentStrength && (
                            <span className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                              {school.studentStrength} Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Principal: <span className="text-slate-600 font-semibold">{school.principalName || "N/A"}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Block */}
                    <div className="flex items-center gap-3 shrink-0">
                      {school.phone && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {school.phone}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(school.id, school.schoolName);
                        }}
                        className="bg-white hover:bg-rose-50 text-rose-600 p-2 md:px-3 md:py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT PANEL: CLEAN / NO BORDER VIEWER ─── */}
      <div className="w-full md:w-[450px] flex flex-col max-h-screen shrink-0 sticky top-0 transition-all duration-200">
        {selectedSchool ? (
          /* जब स्टूडेंट सेलेक्टेड हो तो वाइट बैकग्राउंड में डिटेल दिखेगी */
          <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl overflow-y-auto p-6 space-y-6">
            
            {/* Detail Head */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#0F172A] font-black text-xs uppercase tracking-wider">
                <Users size={14} className="text-indigo-500" /> ADMISSION DETAILS
              </div>
              <button 
                onClick={() => setSelectedId(null)}
                className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md hover:bg-slate-100 transition"
              >
                Close <X size={14} />
              </button>
            </div>

            {/* Profile Header Box */}
            <div className="bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center text-center border border-slate-100 shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-[#0F172A] text-white font-black text-xl flex items-center justify-center shadow-md mb-3">
                {selectedSchool.schoolName ? selectedSchool.schoolName.charAt(0).toUpperCase() : 'S'}
              </div>
              <h2 className="font-extrabold text-slate-900 text-lg leading-tight">
                {selectedSchool.schoolName}
              </h2>
              <span className="mt-2 bg-indigo-50 text-indigo-700 font-bold text-[10px] tracking-wide px-3 py-1 rounded-full border border-indigo-100/50">
                School Profile Matrix
              </span>
            </div>

            {/* Form Fields Blocks */}
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  PRINCIPAL NAME
                </label>
                <div className="w-full bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Users size={13} className="text-slate-400" />
                  {selectedSchool.principalName || "Not Specified"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  MOBILE NUMBER
                </label>
                <div className="w-full bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-800 flex items-center gap-2">
                  <Phone size={13} className="text-slate-400" />
                  {selectedSchool.phone || "Not Linked"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  EMAIL ADDRESS
                </label>
                <div className="w-full bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2 truncate">
                  <Mail size={13} className="text-slate-400" />
                  <span className="truncate">{selectedSchool.email || "No email matrix listed"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  STUDENT STRENGTH METRIC
                </label>
                <div className="w-full bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2">
                  <School size={13} className="text-slate-400" />
                  {selectedSchool.studentStrength || 0} Active Logged Profiles
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  PERMANENT ADDRESS
                </label>
                <div className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-700 flex items-start gap-2 leading-relaxed">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p>{selectedSchool.address || "No structural location specified"}</p>
                    {(selectedSchool.district || selectedSchool.state) && (
                      <p className="text-slate-400 font-medium text-[11px] mt-0.5">
                        {selectedSchool.district && `${selectedSchool.district}, `}
                        {selectedSchool.state} {selectedSchool.pincode && `- ${selectedSchool.pincode}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedSchool.reason && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    PURPOSE NARRATIVE BRIEF
                  </label>
                  <div className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-medium text-slate-600 italic flex items-start gap-2">
                    <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    "{selectedSchool.reason}"
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Giant Action Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDelete(selectedSchool.id, selectedSchool.schoolName)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm active:scale-[0.99]"
              >
                <Trash2 size={16} /> Delete Admission Form
              </button>
            </div>

          </div>
        ) : (
          /* ─── REMOVED BG-WHITE, BORDER & SHADOW FROM PANELS (FLOATING CARD VIEW) ─── */
          <div className="h-full flex justify-center p-8 items-start pt-20">
            <div className="w-full max-w-sm border-2 border-dashed border-slate-200 bg-white rounded-[24px] p-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[220px]">
              {/* Thin Slate User Icon */}
              <User size={36} className="text-slate-300 stroke-[1.25]" />
              
              <div className="space-y-2">
                <h3 className="font-extrabold text-[#7F8EA3] text-xs tracking-wider uppercase">
                  NO STUDENT SELECTED
                </h3>
                <p className="text-xs text-[#94A3B8] max-w-[240px] mx-auto font-medium leading-relaxed">
                  Select a student application to view full admission details.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}