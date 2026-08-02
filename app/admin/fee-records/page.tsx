"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Wallet, IndianRupee, CheckCircle2, XCircle, Search, Trash2,
  Calendar, GraduationCap, Download, Eye, X, Phone, Clock, AlertCircle, 
  FileText, TrendingUp, Sparkles, Users, UserCheck, Filter, ChevronLeft, ChevronRight
} from "lucide-react";

// --- Types ---
type FeeRecord = {
  id: string;
  month: string;
  year: number;
  amount: number;
  utrNumber: string | null;
  status: "PAID" | "REJECTED";
  createdAt: string;
  user: { name: string; phone: string; className: string };
};

type MonthBreakdown = {
  month: string;
  year: number;
  status: "PAID" | "PENDING" | "DUE";
  amount: number;
  utrNumber?: string | null;
};

type FeeStatusStudent = {
  id: string;
  name: string;
  phone: string;
  className: string;
  amount: number;
  status: "PAID" | "PENDING" | "DUE";
  monthlyBreakdown?: MonthBreakdown[];
};

type Summary = { totalCollection: number; monthlyCollection: number; paidStudents: number; rejectedStudents: number };
type FeeStatusSummary = { totalStudents: number; paidStudents: number; pendingApproval: number; dueStudents: number; collection: number; remaining: number };

const MONTHS = ["All Months", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CLASSES = ["All Classes", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const PAGE_SIZE = 15;

export default function FeeRecordsPage() {
  const [activeTab, setActiveTab] = useState<"status" | "history">("status");
  const [loading, setLoading] = useState(true);
  
  // History State
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [summary, setSummary] = useState<Summary>({ totalCollection: 0, monthlyCollection: 0, paidStudents: 0, rejectedStudents: 0 });

  // Fee Status State
  const [feeStatusData, setFeeStatusData] = useState<FeeStatusStudent[]>([]);
  const [statusSearch, setStatusSearch] = useState("");
  const [statusPage, setStatusPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [feeSummary, setFeeSummary] = useState<FeeStatusSummary>({ totalStudents: 0, paidStudents: 0, pendingApproval: 0, dueStudents: 0, collection: 0, remaining: 0 });

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<FeeStatusStudent | null>(null);

  // Load History
  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/fee-records");
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setSummary({
          totalCollection: data.totalCollection || 0,
          monthlyCollection: data.monthlyCollection || 0,
          paidStudents: data.paidStudents || 0,
          rejectedStudents: data.rejectedStudents || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  // Fetch Status
  useEffect(() => {
    if (activeTab !== "status") return;
    const controller = new AbortController();
    const m = selectedMonth === "All Months" ? "" : selectedMonth;
    const c = selectedClass === "All Classes" ? "" : selectedClass;

    fetch(`/api/admin/fee-status?className=${c}&month=${m}&year=${new Date().getFullYear()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeeStatusData(data.students || []);
          setFeeSummary(data.summary || { totalStudents: 0, paidStudents: 0, pendingApproval: 0, dueStudents: 0, collection: 0, remaining: 0 });
        }
      })
      .catch((err) => err.name !== "AbortError" && console.error(err));

    return () => controller.abort();
  }, [activeTab, selectedClass, selectedMonth]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedStudent(null);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch("/api/admin/fee-records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Deleted successfully");
        loadRecords();
      } else alert(data.message || "Failed");
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (!filteredHistory.length) return alert("No data to export!");
    const headers = ["Name,Phone,Class,Month,Year,Amount,UTR,Status,Date"];
    const rows = filteredHistory.map(r => 
      `"${r.user?.name || ""}","${r.user?.phone || ""}","${r.user?.className || ""}","${r.month}",${r.year},${r.amount},"${r.utrNumber || ""}","${r.status}","${r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : ""}"`
    );
    const blob = new Blob(["\uFEFF" + [...headers, ...rows].join("\n")], { type: "text/csv;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fee_History_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Status Filter + Pagination
  const filteredStatus = useMemo(() => {
    const q = statusSearch.toLowerCase().trim();
    if (!q) return feeStatusData;
    return feeStatusData.filter(s => s.name.toLowerCase().includes(q) || s.phone.includes(q));
  }, [feeStatusData, statusSearch]);

  const totalStatusPages = Math.ceil(filteredStatus.length / PAGE_SIZE) || 1;
  const paginatedStatus = useMemo(() => filteredStatus.slice((statusPage - 1) * PAGE_SIZE, statusPage * PAGE_SIZE), [filteredStatus, statusPage]);

  // History Filter + Pagination
  const filteredHistory = useMemo(() => {
    const q = historySearch.toLowerCase().trim();
    if (!q) return records;
    return records.filter(r => r.user?.name?.toLowerCase().includes(q) || r.user?.phone?.includes(q) || r.utrNumber?.toLowerCase().includes(q));
  }, [records, historySearch]);

  const totalHistoryPages = Math.ceil(filteredHistory.length / PAGE_SIZE) || 1;
  const paginatedHistory = useMemo(() => filteredHistory.slice((historyPage - 1) * PAGE_SIZE, historyPage * PAGE_SIZE), [filteredHistory, historyPage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={13} className="text-blue-600" /> Admin Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Fee Management <span className="text-blue-600">System</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Check student fees, pending payments, and payment receipts easily in one place.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-1 self-start lg:self-center">
            {(["status", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                {tab === "status" ? <UserCheck size={16} /> : <TrendingUp size={16} />}
                {tab === "status" ? "Fee Status" : "Payment History"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TAB 1: FEE STATUS OVERVIEW --- */}
      {activeTab === "status" && (
        <div className="space-y-6">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard title="Total Students" value={feeSummary.totalStudents} icon={<Users size={18} className="text-blue-600" />} bg="bg-white border-slate-200" />
            <StatCard title="Paid Students" value={feeSummary.paidStudents} icon={<CheckCircle2 size={18} className="text-emerald-600" />} bg="bg-emerald-50/50 border-emerald-100" valueColor="text-emerald-700" />
            <StatCard title="Pending Review" value={feeSummary.pendingApproval} icon={<Clock size={18} className="text-amber-600" />} bg="bg-amber-50/50 border-amber-100" valueColor="text-amber-700" />
            <StatCard title="Due Students" value={feeSummary.dueStudents} icon={<AlertCircle size={18} className="text-rose-600" />} bg="bg-rose-50/50 border-rose-100" valueColor="text-rose-700" />
            <StatCard title="Total Collected" value={`₹${feeSummary.collection.toLocaleString()}`} icon={<Wallet size={18} className="text-blue-600" />} bg="bg-blue-50/50 border-blue-100" valueColor="text-blue-700" />
            <StatCard title="Pending Amount" value={`₹${feeSummary.remaining.toLocaleString()}`} icon={<IndianRupee size={18} className="text-rose-600" />} bg="bg-rose-50/50 border-rose-100" valueColor="text-rose-700" />
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3">
              <Filter size={14} className="text-blue-600" /> Filter Options
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-600" /> Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setStatusPage(1); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-blue-600" /> Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => { setSelectedClass(e.target.value); setStatusPage(1); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {CLASSES.map(c => <option key={c} value={c}>{c === "All Classes" ? c : `${c} Class`}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Search size={13} className="text-blue-600" /> Search Student
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name or phone..."
                    value={statusSearch}
                    onChange={(e) => { setStatusSearch(e.target.value); setStatusPage(1); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 bg-slate-50">Student Name</th>
                    <th className="p-4 bg-slate-50">Phone Number</th>
                    <th className="p-4 bg-slate-50">Class</th>
                    <th className="p-4 bg-slate-50">Amount</th>
                    <th className="p-4 bg-slate-50">Status</th>
                    <th className="p-4 bg-slate-50 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStatus.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                        No student details found.
                      </td>
                    </tr>
                  ) : (
                    paginatedStatus.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition duration-150 group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-black flex items-center justify-center border border-blue-100">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">{student.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-mono">{student.phone}</td>
                        <td className="p-4 text-slate-600"><span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">{student.className}</span></td>
                        <td className="p-4 font-black text-slate-900">₹{student.amount.toLocaleString()}</td>
                        <td className="p-4"><GlowBadge status={student.status} /></td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 hover:border-blue-600 transition shadow-sm"
                          >
                            <Eye size={13} /> View 
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalStatusPages > 1 && (
              <div className="flex items-center justify-between text-xs text-slate-500 p-4 border-t border-slate-100 bg-slate-50/50">
                <span>Page <strong className="text-slate-800">{statusPage}</strong> of <strong className="text-slate-800">{totalStatusPages}</strong> ({filteredStatus.length} total)</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={statusPage === 1}
                    onClick={() => setStatusPage(p => p - 1)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    disabled={statusPage === totalStatusPages}
                    onClick={() => setStatusPage(p => p + 1)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: PAYMENT HISTORY --- */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Collection" value={`₹${summary.totalCollection.toLocaleString()}`} icon={<Wallet size={20} className="text-blue-600" />} bg="bg-white border-slate-200" />
            <StatCard title="This Month Collection" value={`₹${summary.monthlyCollection.toLocaleString()}`} icon={<IndianRupee size={20} className="text-emerald-600" />} bg="bg-emerald-50/50 border-emerald-100" valueColor="text-emerald-700" />
            <StatCard title="Successful Payments" value={summary.paidStudents} icon={<CheckCircle2 size={20} className="text-blue-600" />} bg="bg-blue-50/50 border-blue-100" valueColor="text-blue-700" />
            <StatCard title="Rejected Payments" value={summary.rejectedStudents} icon={<XCircle size={20} className="text-rose-600" />} bg="bg-rose-50/50 border-rose-100" valueColor="text-rose-700" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone or UTR number..."
                value={historySearch}
                onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 transition"
              />
            </div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20"
            >
              <Download size={14} /> Download Excel / CSV
            </button>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 bg-slate-50">Student</th>
                    <th className="p-4 bg-slate-50">Class</th>
                    <th className="p-4 bg-slate-50">Month</th>
                    <th className="p-4 bg-slate-50">Amount</th>
                    <th className="p-4 bg-slate-50">UTR / Ref No</th>
                    <th className="p-4 bg-slate-50">Status</th>
                    <th className="p-4 bg-slate-50">Date</th>
                    <th className="p-4 bg-slate-50 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading history records...</td></tr>
                  ) : paginatedHistory.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-slate-400">No payment transaction found.</td></tr>
                  ) : (
                    paginatedHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition duration-150">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{record.user?.name || "N/A"}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{record.user?.phone || "N/A"}</div>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{record.user?.className || "N/A"}</td>
                        <td className="p-4 text-slate-700 font-semibold">{record.month} {record.year}</td>
                        <td className="p-4 font-black text-slate-900">₹{record.amount.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit">{record.utrNumber || "N/A"}</td>
                        <td className="p-4"><GlowBadge status={record.status} /></td>
                        <td className="p-4 text-slate-500">{record.createdAt ? new Date(record.createdAt).toLocaleDateString("en-IN") : "N/A"}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalHistoryPages > 1 && (
              <div className="flex items-center justify-between text-xs text-slate-500 p-4 border-t border-slate-100 bg-slate-50/50">
                <span>Page <strong className="text-slate-800">{historyPage}</strong> of <strong className="text-slate-800">{totalHistoryPages}</strong> ({filteredHistory.length} total)</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage(p => p - 1)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    disabled={historyPage === totalHistoryPages}
                    onClick={() => setHistoryPage(p => p + 1)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition flex items-center gap-1 font-semibold"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- STUDENT DETAIL MODAL (Fixed height + Scrollable Ledger Body) --- */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col h-auto max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed top) */}
            <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 relative shrink-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200/60 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 truncate">{selectedStudent.name}</h2>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full uppercase shrink-0">
                      {selectedStudent.className}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                    <Phone size={12} className="text-blue-600 shrink-0" /> {selectedStudent.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 min-h-0 flex-1 text-xs">
              {/* Filter Status Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Selected Month</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{selectedMonth === "All Months" ? "Full Academic Year" : selectedMonth}</span>
                </div>
                <GlowBadge status={selectedStudent.status} />
              </div>

              {/* Monthly Ledger Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 sticky top-0 bg-white py-1.5 z-10">
                  <FileText size={14} className="text-blue-600" /> Student({selectedStudent.monthlyBreakdown?.length || 0} Months)
                </h4>

                <div className="space-y-2.5">
                  {selectedStudent.monthlyBreakdown?.length ? (
                    selectedStudent.monthlyBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50 transition">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800 text-xs">{item.month} {item.year}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span>Amount: <strong className="text-slate-900 font-bold">₹{item.amount}</strong></span>
                            {item.utrNumber && (
                              <span className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                                UTR: {item.utrNumber}
                              </span>
                            )}
                          </div>
                        </div>
                        <GlowBadge status={item.status} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                      No ledger history available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer (Fixed bottom) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-sm active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function StatCard({ title, value, icon, bg = "bg-white", valueColor = "text-slate-900" }: { title: string; value: string | number; icon: React.ReactNode; bg?: string; valueColor?: string }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${bg}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">{title}</span>
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">{icon}</div>
      </div>
      <h2 className={`text-xl font-black mt-2 tracking-tight ${valueColor}`}>{value}</h2>
    </div>
  );
}

function GlowBadge({ status }: { status: string }) {
  const isPaid = status === "PAID";
  const isPending = status === "PENDING";
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
      isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
      isPending ? "bg-amber-50 text-amber-700 border-amber-200" :
      "bg-rose-50 text-rose-700 border-rose-200"
    }`}>
      {isPaid && <CheckCircle2 size={12} />}
      {isPending && <Clock size={12} />}
      {!isPaid && !isPending && <AlertCircle size={12} />}
      {status === "PAID" ? "Paid" : status === "PENDING" ? "Pending Review" : "Due Balance"}
    </span>
  );
}