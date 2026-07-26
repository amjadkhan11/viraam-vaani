"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Check, X } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  createdAt: Date;
};

export default function StudentRow({
  student,
  checked,
  onSelect,
  onActionSuccess,
}: {
  student: Student;
  checked: boolean;
  onSelect: () => void;
  onActionSuccess: (id: string, status: "APPROVED" | "REJECTED") => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: "APPROVED" | "REJECTED") => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/student-approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: student.id, status }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onActionSuccess(student.id, status);
        router.refresh();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors duration-200 group">
      <td className="py-4 px-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={onSelect}
          className="w-4 h-4 accent-blue-600 rounded border-slate-300 cursor-pointer"
        />
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm shadow-blue-500/20">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm capitalize">{student.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {new Date(student.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </td>

      <td className="py-4 px-6 text-xs text-slate-500 space-y-1 whitespace-nowrap">
        <div className="flex items-center gap-2 text-slate-600">
          <Mail size={13} className="text-blue-500 flex-shrink-0" />
          <span>{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Phone size={13} className="text-blue-500 flex-shrink-0" />
          <span>{student.phone}</span>
        </div>
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold tracking-wide">
          {student.className}
        </span>
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      </td>

      <td className="py-4 px-6 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={loading}
            onClick={() => updateStatus("APPROVED")}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-sm transition-all animate-none"
          >
            <Check size={14} />
            {loading ? "..." : "Approve"}
          </button>

          <button
            disabled={loading}
            onClick={() => updateStatus("REJECTED")}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-red-200 hover:border-red-300 text-red-600 text-xs font-semibold shadow-sm hover:bg-red-50/50 transition-all animate-none"
          >
            <X size={14} />
            {loading ? "..." : "Reject"}
          </button>
        </div>
      </td>
    </tr>
  );
}