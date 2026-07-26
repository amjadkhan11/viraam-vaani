"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Bell,
  BookOpen,
  UserCheck,
  Eye,
  Trash2,
  X,
  Download,
  Filter,
  AlertTriangle
} from "lucide-react";

interface DashboardMetrics {
  totalStudents: number;
  totalNotifications: number;
  studyResources: number;
}

interface RosterStudent {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  activeExam: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [allRoster, setAllRoster] = useState<RosterStudent[]>([]);
  const [filteredRoster, setFilteredRoster] = useState<RosterStudent[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedStudent, setSelectedStudent] = useState<RosterStudent | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<string | null>(null);
  
  // Custom Modal States for Professional Look
  const [studentToDelete, setStudentToDelete] = useState<RosterStudent | null>(null);

  const fetchDashboardState = async () => {
    try {
      const response = await fetch("/api/admin/metrics");
      if (!response.ok) throw new Error("Database offline or synchronization error");
      
      const data = await response.json();
      setMetrics(data.metrics);
      setAllRoster(Array.isArray(data.roster) ? data.roster : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardState();
    const interval = setInterval(fetchDashboardState, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🎯 CLASS WISE FILTER LOGIC
  useEffect(() => {
    if (selectedClass === "ALL") {
      setFilteredRoster(allRoster);
    } else {
      setFilteredRoster(allRoster.filter(s => s.className?.toUpperCase() === selectedClass.toUpperCase()));
    }
  }, [selectedClass, allRoster]);

  // 📥 DOWNLOAD EXCEL FUNCTION (CSV format openable in Excel)
  const downloadExcel = () => {
    if (filteredRoster.length === 0) return alert("No records available to export.");
    
    const headers = ["Roll Number", "Full Name", "Class/Course", "Email Address", "Phone Number", "Status"];
    const rows = filteredRoster.map(s => [
      s.rollNo, s.name, s.className, s.email, s.phone, s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Viraam_Vaani_Students_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    const { id: studentId, name: studentName } = studentToDelete;
    
    try {
      setIsDeleteLoading(studentId);
      const res = await fetch(`/api/admin/students/${studentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student record.");
      
      setAllRoster((prev) => prev.filter((s) => s.id !== studentId));
      if (metrics) {
        setMetrics({ ...metrics, totalStudents: Math.max(0, metrics.totalStudents - 1) });
      }
      setStudentToDelete(null); // Close modal on success
    } catch (err: any) {
      alert(err.message || "An error occurred while removing the student.");
    } finally {
      setIsDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Data Console...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      
      {/* 🌟 Top Header Banner */}
      <div className="bg-white border-b border-slate-200/80 py-6 px-6 md:px-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Viraam Vaani</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl self-start sm:self-auto">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-slate-600">Connection Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">

        {/* 📊 METRICS GRID CARD */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Students</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">{metrics?.totalStudents ?? 0}</h3>
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={22} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Notifications</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">{metrics?.totalNotifications ?? 0}</h3>
            </div>
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
              <Bell size={22} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Study Upload</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">{metrics?.studyResources ?? 0}</h3>
            </div>
            <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
              <BookOpen size={22} />
            </div>
          </div>
        </div>

        {/* 📑 ROSTER PANEL WITH CONTROLS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">Total Active Students ({filteredRoster.length})</h2>
            </div>
            
            {/* Action Group: Class Filter & Excel Download */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <Filter size={14} className="text-slate-400" />
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent text-xs font-bold outline-none text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All Classes</option>
                  <option value="8th">8th Class</option>
                  <option value="9th">9th Class</option>
                  <option value="10th">10th Class</option>
                  <option value="11th">11th Class</option>
                  <option value="12th">12th Class</option>
                </select>
              </div>

              <button 
                onClick={downloadExcel}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition shadow-sm"
              >
                <Download size={14} />
                Download Excel
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <th className="p-4 pl-6">Roll Number</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition">
                    <td className="p-4 pl-6 font-mono font-bold text-indigo-600">{student.rollNo}</td>
                    <td className="p-4 font-semibold text-slate-900">{student.name}</td>
                    <td className="p-4 text-slate-600 font-medium">{student.className}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 text-center pr-6 flex justify-center gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View Full Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => setStudentToDelete(student)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                      No approved students discovered in this class roster.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 👁️ STUDENT PROFILE MODAL (POPUP) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wide uppercase">Student Profile </h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Full Name:</span>
                <span className="font-bold text-slate-800 text-right">{selectedStudent.name}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Roll Number:</span>
                <span className="font-mono font-bold text-indigo-600 text-right">{selectedStudent.rollNo}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Class / Course:</span>
                <span className="font-bold text-slate-800 text-right">{selectedStudent.className}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Email Address:</span>
                <span className="font-medium text-slate-800 text-right truncate">{selectedStudent.email}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-medium">Phone Number:</span>
                <span className="font-medium text-slate-800 text-right">{selectedStudent.phone}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-slate-400 font-medium">Verification Status:</span>
                <span className="font-bold text-emerald-600 text-right uppercase text-xs">Official Student</span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 CUSTOM PROFESSIONAL DELETE CONFIRMATION MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Remove Student Record</h3>
                <p className="text-xs md:text-sm text-slate-500">
                  Are you sure you want to remove <span className="font-bold text-slate-800">{studentToDelete.name}</span>? 
                  
                </p>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeleteLoading === studentToDelete.id}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                disabled={isDeleteLoading === studentToDelete.id}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isDeleteLoading === studentToDelete.id ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}