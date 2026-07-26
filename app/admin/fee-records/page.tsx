"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Calendar,
  GraduationCap,
  Download
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

type Summary = {
  totalCollection: number;
  monthlyCollection: number;
  paidStudents: number;
  rejectedStudents: number;
};

type TabType = "history" | "status";

type FeeStatusStudent = {
  id: string;
  name: string;
  phone: string;
  className: string;
  amount: number;
  status: "PAID" | "PENDING" | "DUE";
};

type FeeStatusSummary = {
  totalStudents: number;
  paidStudents: number;
  pendingApproval: number;
  dueStudents: number;
  collection: number;
  remaining: number;
};

const MONTHS = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CLASSES = ["All Classes", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export default function FeeRecordsPage() {
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalCollection: 0,
    monthlyCollection: 0,
    paidStudents: 0,
    rejectedStudents: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;
  
  // CHANGE 1: Default tab set to "status"
  const [activeTab, setActiveTab] = useState<TabType>("status");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const [feeStatusData, setFeeStatusData] = useState<FeeStatusStudent[]>([]);
  const [feeSummary, setFeeSummary] = useState<FeeStatusSummary>({
    totalStudents: 0,
    paidStudents: 0,
    pendingApproval: 0,
    dueStudents: 0,
    collection: 0,
    remaining: 0,
  });

  // --- Effects ---
  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (activeTab === "status") {
      loadFeeStatus();
    }
  }, [activeTab, selectedClass, selectedMonth]);

  // --- API Calls ---
  async function loadRecords() {
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
  }

  async function loadFeeStatus() {
    try {
      // Backend handles empty/all values if we pass them correctly or conditionalize them
      const monthParam = selectedMonth === "All Months" ? "" : selectedMonth;
      const classParam = selectedClass === "All Classes" ? "" : selectedClass;
      
      const res = await fetch(
        `/api/admin/fee-status?className=${classParam}&month=${monthParam}&year=${selectedYear}`
      );
      const data = await res.json();
      if (data.success) {
        setFeeStatusData(data.students || []);
        setFeeSummary(data.summary || {
          totalStudents: 0, paidStudents: 0, pendingApproval: 0, dueStudents: 0, collection: 0, remaining: 0
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteRecord(id: string) {
    if (!confirm("Are you sure you want to delete this fee record?")) return;
    try {
      const res = await fetch("/api/admin/fee-records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Record deleted successfully");
        loadRecords();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  }

  // --- Excel/CSV Download Function ---
  const downloadExcel = () => {
    if (feeStatusData.length === 0) {
      alert("There is no data available to download!");
      return;
    }

    // CSV Headers
    const headers = ["Student Name", "Phone", "Class", "Amount", "Status"];
    
    // CSV Rows mapping
    const rows = feeStatusData.map(student => [
      `"${student.name.replace(/"/g, '""')}"`,
      `"${student.phone}"`,
      `"${student.className}"`,
      student.amount,
      `"${student.status}"`
    ]);

    // Combine headers and rows
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    // Create download link element
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fee_Status_${selectedClass}_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };

  // --- Memoized Filters & Pagination ---
  const filteredRecords = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return records;
    return records.filter((r) => 
      r.user.name.toLowerCase().includes(value) ||
      r.user.phone.includes(value) ||
      (r.utrNumber || "").toLowerCase().includes(value)
    );
  }, [records, search]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredRecords, page]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 p-6 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2942] tracking-tight">
            Fee Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track student fee statuses, payment histories, and collection insights.
          </p>
        </div>

        {/* Tab Switcher - Blue & Gold Styling */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit self-start">
          <button
            onClick={() => setActiveTab("status")}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "status"
                ? "bg-[#0f2942] text-[#d4af37] shadow-sm"
                : "text-slate-600 hover:text-[#0f2942]"
            }`}
          >
            Fee Status 
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "history"
                ? "bg-[#0f2942] text-[#d4af37] shadow-sm"
                : "text-slate-600 hover:text-[#0f2942]"
            }`}
          >
            Payment History
          </button>
        </div>
      </div>

      {/* --- FEE STATUS TAB CONTENT --- */}
      {activeTab === "status" && (
        <div className="space-y-6">
          {/* Status Summaries */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <MiniCard title="Total Students" value={feeSummary.totalStudents} borderStyle="border-l-4 border-l-[#0f2942]" />
            <MiniCard title="Paid Status" value={feeSummary.paidStudents} textStyle="text-emerald-600" borderStyle="border-l-4 border-l-emerald-500" />
            <MiniCard title="Pending Review" value={feeSummary.pendingApproval} textStyle="text-amber-500" borderStyle="border-l-4 border-l-amber-500" />
            <MiniCard title="Due Balance" value={feeSummary.dueStudents} textStyle="text-rose-600" borderStyle="border-l-4 border-l-rose-500" />
            <MiniCard title="Collected" value={`₹${feeSummary.collection}`} textStyle="text-[#0f2942]" borderStyle="border-l-4 border-l-[#d4af37]" />
            <MiniCard title="Outstanding" value={`₹${feeSummary.remaining}`} textStyle="text-rose-600" borderStyle="border-l-4 border-l-rose-600" />
          </div>

          {/* Quick Filters + Excel Download Button */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
              <h3 className="text-sm font-bold text-[#0f2942]">Filter & Actions</h3>
              
              {/* CHANGE 2: Download Excel Button */}
              <button
                onClick={downloadExcel}
                className="inline-flex items-center justify-center gap-2 bg-[#0f2942] text-[#d4af37] border border-[#d4af37]/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#163b5e] transition shadow-sm"
              >
                <Download size={14} /> Export Excel (CSV)
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <Calendar size={14} className="text-[#d4af37]" /> Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-2.5 outline-none focus:border-[#0f2942] focus:ring-1 focus:ring-[#0f2942] transition"
                >
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <GraduationCap size={16} className="text-[#d4af37]" /> Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-2.5 outline-none focus:border-[#0f2942] focus:ring-1 focus:ring-[#0f2942] transition"
                >
                  {CLASSES.map((c) => <option key={c} value={c}>{c === "All Classes" ? c : `${c} Class`}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Fee</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {feeStatusData.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-slate-400">No student status records found for this criteria.</td></tr>
                  ) : (
                    feeStatusData.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 font-semibold text-[#0f2942]">{student.name}</td>
                        <td className="p-4 text-slate-600">{student.phone}</td>
                        <td className="p-4 text-slate-500">{student.className}</td>
                        <td className="p-4 font-bold text-[#0f2942]">₹{student.amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            student.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            student.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {student.status === "PAID" ? "Paid" : student.status === "PENDING" ? "Pending Approval" : "Due"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- HISTORY TAB CONTENT --- */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Card title="Total Collection" value={`₹${summary.totalCollection}`} icon={<Wallet className="text-[#d4af37]" size={24} />} />
            <Card title="Monthly Collection" value={`₹${summary.monthlyCollection}`} icon={<IndianRupee className="text-emerald-600" size={24} />} />
            <Card title="Paid Students" value={summary.paidStudents} icon={<CheckCircle2 className="text-blue-600" size={24} />} />
            <Card title="Rejected Payments" value={summary.rejectedStudents} icon={<XCircle className="text-rose-600" size={24} />} />
          </div>

          {/* Search bar */}
          <SearchBar search={search} setSearch={setSearch} setPage={setPage} />

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Student Details</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Fee Month</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">UTR Number</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Processed Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading records...</td></tr>
                  ) : paginatedRecords.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-slate-400">No records found matching search criteria.</td></tr>
                  ) : (
                    paginatedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4">
                          <div className="font-semibold text-[#0f2942]">{record.user.name}</div>
                          <div className="text-xs text-slate-400">{record.user.phone}</div>
                        </td>
                        <td className="p-4 text-slate-600">{record.user.className}</td>
                        <td className="p-4 text-slate-600 font-medium">{record.month} {record.year}</td>
                        <td className="p-4 font-bold text-[#0f2942]">₹{record.amount}</td>
                        <td className="p-4">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                            {record.utrNumber || "N/A"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            record.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {record.status === "PAID" ? "Paid" : "Rejected"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{new Date(record.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-rose-100 transition border border-rose-200"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * pageSize, filteredRecords.length)}</span> of{" "}
                <span className="font-medium">{filteredRecords.length}</span> entries
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-xs font-medium border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-xs font-medium border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- HELPER SUB-COMPONENTS ---
function Card({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition duration-200">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h2 className="text-2xl font-bold text-[#0f2942] mt-1.5">{value}</h2>
      </div>
      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
    </div>
  );
}

function MiniCard({ title, value, textStyle = "text-[#0f2942]", borderStyle = "" }: { title: string; value: number | string; textStyle?: string; borderStyle?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm ${borderStyle}`}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide truncate">{title}</p>
      <h2 className={`text-xl font-bold mt-1 ${textStyle}`}>{value}</h2>
    </div>
  );
}

function SearchBar({ search, setSearch, setPage }: { search: string; setSearch: (v: string) => void; setPage: (p: number) => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm max-w-md">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search student, phone or UTR..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border-none bg-slate-50 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#0f2942] transition"
        />
      </div>
    </div>
  );
}