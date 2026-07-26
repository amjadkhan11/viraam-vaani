"use client";

import { useMemo, useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import StudentRow from "./StudentRow";
import { Search, Check, X, ChevronDown } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  createdAt: Date;
};

export default function StudentApprovalTable({
  students: initialStudents,
}: {
  students: Student[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [isOpen, setIsOpen] = useState(false); // Custom dropdown open state
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);
  const [totalApprovedCount, setTotalApprovedCount] = useState<number>(0);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("total_approved_lifetime_count");
    if (saved) {
      setTotalApprovedCount(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("total_approved_lifetime_count", totalApprovedCount.toString());
    }
  }, [totalApprovedCount, isMounted]);

  // Dropdown ke bahar click karne par use band karne ke liye
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeStudents = useMemo(() => {
    return initialStudents.filter((s) => !removedIds.includes(s.id));
  }, [initialStudents, removedIds]);

  const uniqueClassesCount = useMemo(() => {
    return new Set(activeStudents.map((s) => s.className)).size;
  }, [activeStudents]);

  const classOptions = useMemo(() => {
    const classes = [...new Set(activeStudents.map((s) => s.className))].sort();
    return ["All", ...classes];
  }, [activeStudents]);

  const avgWaitingTime = useMemo(() => {
    if (activeStudents.length === 0) return "0h";
    const totalMs = activeStudents.reduce((acc, curr) => {
      return acc + (new Date().getTime() - new Date(curr.createdAt).getTime());
    }, 0);
    const avgHours = Math.round(totalMs / activeStudents.length / (1000 * 60 * 60));
    return avgHours > 0 ? `${avgHours}h` : "1h";
  }, [activeStudents]);

  const filteredStudents = useMemo(() => {
    return activeStudents.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchClass =
        selectedClass === "All" || student.className === selectedClass;

      return matchSearch && matchClass;
    });
  }, [activeStudents, search, selectedClass]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleSingleAction = (id: string, status: "APPROVED" | "REJECTED") => {
    if (status === "APPROVED") {
      setTotalApprovedCount((prev) => prev + 1);
    }
    setRemovedIds((prev) => [...prev, id]);
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const bulkAction = async (status: "APPROVED" | "REJECTED") => {
    if (selectedIds.length === 0) {
      return alert("Please select students.");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/bulk-student-approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (status === "APPROVED") {
          setTotalApprovedCount((prev) => prev + selectedIds.length);
        }
        setRemovedIds((prev) => [...prev, ...selectedIds]);
        setSelectedIds([]);
        router.refresh();
      } else {
        alert(data.error || "Failed to process bulk request");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-0 w-full overflow-x-hidden box-border">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Student Approvals
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review and approve new student registration requests
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-100 shadow-sm self-start md:self-auto">
          <span>Dashboard</span>
          <span className="text-slate-300">&gt;</span>
          <span className="text-slate-800 font-medium">Student Approvals</span>
        </div>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Requests</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{activeStudents.length}</h3>
            <p className="text-xs text-slate-400 mt-1">Total pending students</p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">👥</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Approved</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1">{isMounted ? totalApprovedCount : 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Lifetime approvals recorded</p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">✅</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Classes</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{uniqueClassesCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Active classes</p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">🎓</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Waiting Time</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{avgWaitingTime}</h3>
            <p className="text-xs text-slate-400 mt-1">Average waiting time</p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">🕒</div>
        </div>
      </div>

      {/* Filter Toolbar - CUSTOM TAILWIND DROPDOWN FIXED */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center w-full max-w-full box-border">
        <div className="relative w-full flex-1 min-w-0">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm truncate"
          />
        </div>

        {/* Custom Dropdown Trigger Container */}
        <div className="w-full md:w-48 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-medium flex items-center justify-between transition-all"
          >
            <span className="truncate">
              {selectedClass === "All" ? "All Classes" : selectedClass}
            </span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Custom Dropdown Content Menu (Always bounded to parent element) */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in-50 slide-in-from-top-1 duration-150">
              {classOptions.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setSelectedClass(cls);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${
                    selectedClass === cls ? "bg-blue-50/70 text-blue-600 font-semibold" : "text-slate-600"
                  }`}
                >
                  {cls === "All" ? "All Classes" : cls}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Header Block */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden w-full box-border">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="checkbox"
            checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
            onChange={toggleSelectAll}
            className="w-4 h-4 accent-blue-600 rounded cursor-pointer border-slate-300 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Select All</span>
              {selectedIds.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium tracking-wide">
                  Selected: {selectedIds.length} {selectedIds.length === 1 ? "student" : "students"}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-normal truncate">Select all visible students</span>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              disabled={loading}
              onClick={() => bulkAction("APPROVED")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-colors shadow-sm flex-1 sm:flex-initial"
            >
              <Check size={16} /> Approve
            </button>
            <button
              disabled={loading}
              onClick={() => bulkAction("REJECTED")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-sm transition-colors shadow-sm flex-1 sm:flex-initial"
            >
              <X size={16} /> Reject
            </button>
          </div>
        )}
      </div>

      {/* Table Container Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full box-border">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-12"></th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Class</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    checked={selectedIds.includes(student.id)}
                    onSelect={() => toggleSelect(student.id)}
                    onActionSuccess={handleSingleAction}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-slate-400 font-medium">
                    No pending students found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 w-full box-border">
          <div className="text-center sm:text-left">Showing 1 to {filteredStudents.length} of {filteredStudents.length} students</div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400">&lt;</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">3</button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}