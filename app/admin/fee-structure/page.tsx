"use client";

import { useEffect, useState } from "react";
import { 
  Trash2,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  Clock,
  Search,
  Award,
   PlayCircle,
} from "lucide-react";

export default function AdminYearlyFeeManagement() {
  const currentSystemYear = new Date().getFullYear();

  const [fees, setFees] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [className, setClassName] = useState("");
  const [amount, setAmount] = useState("");
  const [targetYear, setTargetYear] = useState(currentSystemYear.toString());

  useEffect(() => {
    loadDatabaseRecords();
  }, []);

  async function loadDatabaseRecords() {
    try {
      setLoading(true);
      
      // 1. Load Active Fees
      const resFees = await fetch("/api/admin/fee-structure");
      const dataFees = await resFees.json();
      if (dataFees.success && Array.isArray(dataFees.fees)) {
        setFees(dataFees.fees);
      } else {
        setFees([]);
      }

      // 2. Load Pending Approvals
      const resApprovals = await fetch("/api/admin/fee-structure?type=pending");
      const dataApprovals = await resApprovals.json();
      if (dataApprovals.success && Array.isArray(dataApprovals.data)) {
        setPendingApprovals(dataApprovals.data);
      } else {
        setPendingApprovals([]);
      }

    } catch (err) {
      console.error("Error parsing frontend data fetching pipeline:", err);
      setFees([]);
      setPendingApprovals([]);
    } finally {
      setLoading(false);
    }
  }
const handleGenerateFees = async () => {
  if (!confirm("Are you sure you want to generate the current month's fee for all approved students?")) {
    return;
  }

  try {
    const res = await fetch("/api/admin/fee-structure?type=generate", {
      method: "POST",
    });

    const data = await res.json();

    if (data.success) {
      alert(data.message);
      await loadDatabaseRecords();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert("Fee generation failed!");
  }
};
  const handleSetYearlyFee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!className || !amount || !targetYear) {
      alert("Please enter the Class, Amount, and Year!");
      return;
    }

    try {
      const res = await fetch("/api/admin/fee-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: className.trim(),
          amount: Number(amount),
          year: Number(targetYear),
          effectiveFrom: new Date().toISOString()
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("🎯 Rule successfully applied!");
        setClassName("");
        setAmount("");
        await loadDatabaseRecords(); 
      } else {
        alert(`Database Error: ${data.error}`);
      }
    } catch (err) {
      alert("Submission failed!");
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!confirm("Do you really want to delete this fee structure?")) return;

    try {
      const res = await fetch(`/api/admin/fee-structure?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Rule deleted!");
        await loadDatabaseRecords();
      } else {
        alert(data.error); 
      }
    } catch (err) {
      alert("Delete operation failed!");
    }
  };

  const handleApproval = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/fee-structure", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeId: id, action })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Done: ${action}`);
        await loadDatabaseRecords(); 
      }
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6 text-slate-800">
      
      {/* Rich Blue & Gold Accent Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border-b-4 border-amber-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award size={14} className="text-amber-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">Executive Console</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Yearly Fee Management</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">Configure class-wise and year-wise fees, and approve pending UTR payments.</p>
        </div>
        <button 
          onClick={loadDatabaseRecords} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-600 text-slate-950 text-sm font-bold rounded-xl transition shadow-sm active:scale-95"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Sync Data"}
        </button>
        <button
  onClick={handleGenerateFees}
  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition shadow-sm active:scale-95"
>
  <PlayCircle size={16} />
  Generate Current Month Fee
</button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Rule Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 self-start">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm md:text-base border-b pb-3">
            <PlusCircle size={18} className="text-blue-900" />
            <span>Create Fee Rule</span>
          </div>
          
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Target Year</label>
              <input 
                type="number" 
                value={targetYear} 
                onChange={(e) => setTargetYear(e.target.value)} 
                className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Class</label>
              <input 
                placeholder="e.g. 7th" 
                value={className} 
                onChange={(e) => setClassName(e.target.value)} 
                className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Fee Amount (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 800" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
              />
            </div>
            <button 
              onClick={handleSetYearlyFee} 
              className="w-full bg-blue-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 rounded-xl text-sm transition shadow-sm border border-blue-950"
            >
              Apply Rule
            </button>
          </div>
        </div>

        {/* Directory Card/Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm md:text-base">
              <FileSpreadsheet size={18} className="text-blue-900" />
              <span>Active Fees Directory</span>
            </div>
            
            {/* Search Filter */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input 
                placeholder="Filter class..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-blue-900" 
              />
            </div>
          </div>

          {/* Laptop Table View */}
          <div className="hidden md:block overflow-hidden border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-bold">
                <tr>
                  <th className="p-3">Year</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Fee Amount</th>
                  <th className="p-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {fees
                  .filter(f => f?.className?.toLowerCase().includes(search.toLowerCase()))
                  .map((fee, i) => (
                    <tr key={fee.id || fee._id || i} className="hover:bg-slate-50/60">
                      <td className="p-3 whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2.5 py-1 rounded font-mono text-[10px] font-bold">
                          {fee.year}
                        </span>
                      </td>
                      <td className="p-3 text-slate-900 font-semibold uppercase">{fee.className}</td>
                      <td className="p-3 text-blue-900 font-bold">₹{fee.amount}</td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDeleteFee(fee.id || fee._id)} 
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                {!loading && fees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">
                      No active structures found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stack Cards View */}
          <div className="block md:hidden space-y-3">
            {fees
              .filter(f => f?.className?.toLowerCase().includes(search.toLowerCase()))
              .map((fee, i) => (
                <div key={fee.id || fee._id || i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-50 border border-blue-100 text-blue-900 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold">
                      Year {fee.year}
                    </span>
                    <button 
                      onClick={() => handleDeleteFee(fee.id || fee._id)} 
                      className="text-rose-600 bg-white border border-slate-200 p-1.5 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Class</p>
                      <p className="text-sm font-semibold text-slate-900 uppercase">{fee.className}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Amount</p>
                      <p className="text-sm font-bold text-blue-900">₹{fee.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            {!loading && fees.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                No active structures found.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Approvals Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-900 bg-slate-50/50">
          <Clock size={18} className="text-amber-600" />
          <span>Pending UTR Approvals</span>
        </div>
        
        {/* Laptop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-bold">
              <tr>
                <th className="p-4">Student Info</th>
                <th className="p-4">Class</th>
                <th className="p-4">Period</th>
                <th className="p-4">Amount</th>
                <th className="p-4">UTR Details</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {pendingApprovals.map((approval, i) => (
                <tr key={approval.id || approval._id || i} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{approval.user?.name || "N/A"}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">📞 {approval.user?.phone || "N/A"}</div>
                  </td>
                  <td className="p-4 uppercase text-slate-900 font-semibold">{approval.user?.className || "N/A"}</td>
                  <td className="p-4 text-slate-500">
                    {approval.month} {approval.year}
                  </td>
                  <td className="p-4 font-bold text-blue-900">₹{approval.amount}</td>
                  <td className="p-4">
                    <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded font-mono text-[10px] font-bold">
                      {approval.utrNumber}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex gap-2">
                      <button 
                        onClick={() => handleApproval(approval.id || approval._id, "APPROVE")} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleApproval(approval.id || approval._id, "REJECT")} 
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingApprovals.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                    No Payments Awaiting Approval!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stack Cards View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {pendingApprovals.map((approval, i) => (
            <div key={approval.id || approval._id || i} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{approval.user?.name || "N/A"}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">📞 {approval.user?.phone || "N/A"}</p>
                </div>
                <span className="bg-blue-50 border border-blue-100 text-blue-900 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                  Class {approval.user?.className || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Period</p>
                  <p className="font-semibold text-slate-700">{approval.month} {approval.year}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Amount Claimed</p>
                  <p className="font-bold text-blue-900">₹{approval.amount}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold mb-1">UTR Reference</span>
                  <span className="inline-block bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded font-mono text-[11px] font-bold">
                    {approval.utrNumber}
                  </span>
                </div>
                
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => handleApproval(approval.id || approval._id, "APPROVE")} 
                    className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleApproval(approval.id || approval._id, "REJECT")} 
                    className="flex-1 bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pendingApprovals.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-semibold text-xs">
              🎉 The queue is empty! Everything is clear.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}