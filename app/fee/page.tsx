"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Layers, Calendar, CreditCard, 
  Clock, X, Send, Download, AlertTriangle, CheckCircle2, ShieldCheck, QrCode
} from "lucide-react";

interface FeeRecord {
  id: string;
  month: string; 
  year: number;
  amount: number;
  status: "UNPAID" | "PENDING" | "PAID" | "REJECTED";
  utrNumber: string | null;
  updatedAt?: string;
  createdAt?: string;
}

interface StudentUser {
  name: string;
  className: string;
  phone: string;
  email: string;
}

export default function StudentFeeDashboard() {
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Database Fetch Pipeline
  const fetchStudentDataFromDatabase = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setGlobalError(null);
      
      const res = await fetch(`/api/fee?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error(`Server status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        const freshFees = data.fees || [];
        setFees(freshFees);
        if (selectedFee) {
          const updatedFee = (freshFees as FeeRecord[]).find(f => f.id === selectedFee.id);
          if (updatedFee) setSelectedFee(updatedFee);
        }
      } else {
        throw new Error(data.error || "Failed to process records.");
      }
    } catch (err: any) {
      setGlobalError(err.message || "Error loading records.");
    } finally {
      setLoading(false);
    }
  }, [selectedFee]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setStudent(parsedUser);
        if (parsedUser?.email) fetchStudentDataFromDatabase(parsedUser.email);
      } catch (e) {
        setGlobalError("Failed to parse user configuration.");
        setLoading(false);
      }
    } else {
      setGlobalError("No active session found.");
      setLoading(false);
    }
  }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !student?.email) return;

    const trimmedUTR = utrNumber.trim();
    if (!trimmedUTR || trimmedUTR.length < 6) {
      alert("⚠️ Please enter a valid UTR ID!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/fee", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedFee.id,
          utrNumber: trimmedUTR,
          userEmail: student.email
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("🚀 Transaction logged successfully!");
        setUtrNumber("");
        setIsModalOpen(false);
        await fetchStudentDataFromDatabase(student.email);
      } else {
        alert(data.error || "Ingestion failed.");
      }
    } catch (err) {
      alert("❌ Server connection issue.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerNativePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading && fees.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-bold text-slate-700 uppercase tracking-wider text-xs">Loading records...</p>
      </div>
    );
  }

  return (
    <>
      {/* Custom Scrollbar & Print Styling */}
      <style jsx global>{`
        .cards-scroll-box::-webkit-scrollbar {
          width: 5px;
        }
        .cards-scroll-box::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .cards-scroll-box::-webkit-scrollbar-thumb {
          background: #1d4ed8;
          border-radius: 10px;
        }
        .cards-scroll-box::-webkit-scrollbar-thumb:hover {
          background: #1e40af;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-receipt-content, #printable-receipt-content * {
            visibility: visible !important;
          }
          #printable-receipt-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            padding: 24px !important;
            margin: 0 !important;
            background: #ffffff !important;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Container - Fresh Blue & Slate White Background */}
      <div className="print:hidden min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4 md:p-8 font-sans relative overflow-hidden">
        
        {/* Light Mesh Accent Blurs (Hero Theme) */}
        <div className="absolute top-20 left-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          
          {/* HERO BRANDING PROFILE BANNER CARD */}
          {student && (
            <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden">
              
              {/* Internal Decorative Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
                <div className="space-y-2 flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                    💳 Viraam Vaani Payment Portal
                  </span>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white capitalize">
                    {student.name}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                    <span className="text-xs md:text-sm font-semibold text-white bg-white/15 border border-white/20 px-3.5 py-1 rounded-full backdrop-blur-md">
                      📚 Class: <span className="font-bold text-white">{student.className || "N/A"}</span>
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-white bg-white/15 border border-white/20 px-3.5 py-1 rounded-full backdrop-blur-md">
                      📞 {student.phone}
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-white bg-white/15 border border-white/20 px-3.5 py-1 rounded-full backdrop-blur-md">
                      📧 {student.email}
                    </span>
                  </div>
                </div>

                <div className="z-10 bg-white/15 border border-white/25 px-5 py-3 rounded-2xl text-center md:text-right shrink-0 backdrop-blur-md">
                  <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider block">Total Ledgers</span>
                  <span className="text-xl md:text-2xl font-black text-white">{fees.length} Records</span>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Fee Cards Container */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-700 via-blue-600 to-slate-700 rounded-l-2xl" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 pl-2">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700"><Calendar size={18} /></span>
                Academic Fee Dashboard
              </h2>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Scroll to view all</span>
            </div>

            <div className="max-h-[380px] md:max-h-[420px] overflow-y-auto pr-2 cards-scroll-box pl-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fees.map((fee) => (
                  <div 
                    key={fee.id}
                    onClick={() => {
                      setSelectedFee(fee);
                      setIsModalOpen(true);
                    }}
                    className="group bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-white flex flex-col justify-between gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">{fee.month} {fee.year}</p>
                        <p className="text-2xl font-black text-slate-900 mt-0.5">₹{fee.amount}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                        fee.status === "PAID" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        fee.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        fee.status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {fee.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold pt-3 border-t border-slate-100">
                      <span className="text-slate-500 group-hover:text-blue-700 transition-colors">
                        {fee.status === "PAID" 
                          ? "View Receipt" 
                          : fee.status === "REJECTED" 
                          ? "Re-submit Payment" 
                          : "Receipt & Pay"
                        }
                      </span>

                      {fee.status === "REJECTED" ? (
                        <span className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-wider uppercase transition-all">
                          PAY AGAIN
                        </span>
                      ) : (
                        <span className="text-blue-700 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal View */}
      {isModalOpen && selectedFee && student && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:static animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto cards-scroll-box print:max-h-none print:overflow-visible print:shadow-none print:p-0 print:rounded-none border border-slate-200/80 print:border-none">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 print:hidden">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-50 text-blue-700"><CreditCard size={16} /></span>
                Invoice Statement
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setUtrNumber(""); }}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold bg-transparent border-none outline-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Payment Section (UNPAID / REJECTED) */}
            {(selectedFee.status === "UNPAID" || selectedFee.status === "REJECTED") && (
              <div className="space-y-4 print:hidden">

                {selectedFee.status === "REJECTED" && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3.5 rounded-2xl text-xs space-y-1">
                    <p className="font-black text-rose-700 uppercase flex items-center gap-1">
                      ⚠️ Payment Rejected by Admin
                    </p>
                    <p className="text-[11px] text-rose-800 leading-snug">
                     Your previously submitted UTR has been rejected. Please enter the correct UTR and resubmit your payment.
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <QrCode size={12} /> Scan & Pay via Any UPI App
                  </div>
                  
                  <div className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <img src="/upi-qr.png" alt="UPI QR Code" className="w-40 h-40 object-contain rounded-xl" />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Amount to Pay:</p>
                    <p className="text-2xl font-black text-slate-900">₹{selectedFee.amount}.00</p>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                      {selectedFee.status === "REJECTED" ? "New Transaction UTR / Reference ID:" : "Transaction UTR / Reference ID:"}
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 4029XXXXXXXX (12 Digits)" 
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 text-xs font-mono font-extrabold text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide shadow-md hover:scale-[1.02] transition-all cursor-pointer border-none outline-none active:scale-95 disabled:opacity-50"
                  >
                    {submitting 
                      ? "SUBMITTING..." 
                      : selectedFee.status === "REJECTED" 
                        ? "🔄 PAY AGAIN & SUBMIT NEW UTR" 
                        : "Submit Transaction Reference"
                    }
                  </button>
                </form>
              </div>
            )}

            {/* Pending State View */}
            {selectedFee.status === "PENDING" && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-center text-slate-900 space-y-2 print:hidden">
                <Clock className="mx-auto text-amber-600 animate-pulse" size={24} />
                <p className="font-black text-xs uppercase tracking-wide">Verification In Progress</p>
                <p className="text-[11px] text-slate-600">Your payment is pending approval. ✅</p>
                <div className="bg-white p-2.5 rounded-xl font-mono text-xs font-bold text-slate-800 border border-amber-200/80 mt-1">
                  UTR: {selectedFee.utrNumber || "N/A"}
                </div>
              </div>
            )}

            {/* Paid State View - Ultra Clean Official Fee Receipt */}
            {selectedFee.status === "PAID" && (
              <div className="space-y-5">
                <div 
                  id="printable-receipt-content" 
                  className="bg-white p-6 border border-slate-200 rounded-2xl font-sans text-slate-900 relative overflow-hidden space-y-5"
                  style={{ width: "100%", boxSizing: "border-box" }}
                >
                  {/* Subtle Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                    <h1 className="text-7xl font-black tracking-widest text-slate-900 rotate-12 uppercase">VIRAAM VAANI</h1>
                  </div>

                  {/* 1. Header Section */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-slate-50">
                        <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">VIRAAM VAANI</h2>
                        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">FeeReceipt</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        PAID ✅
                      </span>
                      <p className="text-[10px] font-bold text-slate-500 font-mono">Receipt No: VVC-{(selectedFee.id || "00").slice(-4)}</p>
                    </div>
                  </div>

                  {/* 2. Student & Billing Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 relative z-10">
                    <div className="space-y-1">
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">STUDENT INFORMATION</p>
                      <p className="font-black text-slate-900 text-xs uppercase">{student.name}</p>
                      <p className="text-slate-600 text-[11px]"><span className="font-medium text-slate-500">Class:</span> {student.className || "10th"}</p>
                      <p className="text-slate-600 text-[11px]"><span className="font-medium text-slate-500">Phone:</span> {student.phone}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">PAYMENT DETAILS</p>
                      <p className="font-bold text-blue-700 text-xs">{selectedFee.month.toUpperCase()}, {selectedFee.year}</p>
                      <p className="text-slate-600 text-[11px]">
                        <span className="font-medium text-slate-500">Date:</span>{" "}
                        {selectedFee.updatedAt
                          ? new Date(selectedFee.updatedAt).toLocaleDateString("en-GB")
                          : selectedFee.createdAt
                          ? new Date(selectedFee.createdAt).toLocaleDateString("en-GB")
                          : new Date().toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-slate-500 text-[10px] truncate">{student.email}</p>
                    </div>
                  </div>

                  {/* 3. Clean Fee Breakdown Table */}
                  <div className="relative z-10">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 text-[9px] uppercase font-bold tracking-wider">
                          <th className="py-2">Description</th>
                          <th className="py-2 text-center">Period</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="font-medium text-slate-800 text-[11px]">
                          <td className="py-2.5">Academic Tuition Fee</td>
                          <td className="py-2.5 text-center text-slate-500">{selectedFee.month.slice(0,3)}/{selectedFee.year}</td>
                          <td className="py-2.5 text-right font-bold text-slate-900">₹{selectedFee.amount}.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 4. Total Amount Bar */}
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-3 rounded-xl relative z-10">
                    <span className="uppercase text-[10px] font-bold tracking-wider text-blue-100">Total Paid Amount:</span>
                    <span className="text-white text-base font-black">₹{selectedFee.amount}.00</span>
                  </div>

                  {/* 5. Transaction Verification Box */}
                  <div className="border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-[10px] space-y-1 relative z-10">
                    <p className="font-bold text-[9px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-600" /> Verification Particulars
                    </p>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Payment Method: <strong className="font-semibold text-slate-900">Online UPI Transfer</strong></span>
                      <span className="font-mono text-slate-900 font-bold">UTR: {selectedFee.utrNumber || "SYSTEM_VERIFIED"}</span>
                    </div>
                  </div>

                  {/* 6. Footer - Stamp & Signature Area */}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-end relative z-10">
                    <div className="text-[9px] text-slate-400 space-y-0.5">
                      <p className="font-medium text-slate-500">Thank you for your prompt payment.</p>
                      <p className="italic">Computer Generated Official Invoice.</p>
                    </div>

                    <div className="relative flex flex-col items-center justify-end w-36 h-24">
                      {/* Stamp Alignment */}
                      <div className="absolute top-0 right-1 w-24 h-24 pointer-events-none opacity-80 rotate-[-10deg] z-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#c53030] fill-current">
                          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" />
                          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
                          
                          <defs>
                            <path id="topTextArc" d="M 15,50 A 35,35 0 0,1 85,50" fill="none" />
                            <path id="bottomTextArc" d="M 12,50 A 38,38 0 0,0 88,50" fill="none" />
                          </defs>

                          <text fontSize="7.5" fontWeight="900" letterSpacing="1.2" fill="currentColor">
                            <textPath href="#topTextArc" startOffset="50%" textAnchor="middle" dy="-2">
                              ★ VIRAAM ★
                            </textPath>
                          </text>

                          <text fontSize="7.5" fontWeight="900" letterSpacing="1.2" fill="currentColor">
                            <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle" dy="6">
                              ★ VAANI ★
                            </textPath>
                          </text>

                          <line x1="8" y1="39" x2="92" y2="39" stroke="currentColor" strokeWidth="1" />
                          <line x1="8" y1="58" x2="92" y2="58" stroke="currentColor" strokeWidth="1" />
                          <text x="50" y="51" fontSize="9" fontWeight="900" fill="currentColor" textAnchor="middle" letterSpacing="1.5">
                            APPROVED
                          </text>
                        </svg>
                      </div>

                      {/* Signature Overlay */}
                      <div className="relative z-10 w-full text-center flex flex-col items-center">
                        <div className="h-7 flex items-end justify-center mb-1">
                          <span className="font-serif italic text-base font-bold text-slate-800 tracking-tighter -rotate-3 select-none">
                            Md Adil
                          </span>
                        </div>

                        <div className="border-t border-slate-700 w-full pt-0.5">
                          <p className="text-[9px] font-bold text-slate-900 uppercase tracking-tight">Authorized Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <button 
                  onClick={triggerNativePrint}
                  className="print:hidden w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:scale-[1.02] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95 cursor-pointer border-none outline-none"
                >
                  <Download size={14} /> PRINT OR SAVE RECEIPT (PDF)
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}