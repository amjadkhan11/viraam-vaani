"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Mail, Search, Printer, FileText, ShieldAlert, RefreshCw } from "lucide-react";

export default function StudentAdmitCardPortal() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [admitCardData, setAdmitCardData] = useState<any>(null);

  useEffect(() => {
    const sessionToken = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!sessionToken) {
      router.push("/login");
    } else {
      if (userEmail) {
        setEmail(userEmail);
        setLoggedInEmail(userEmail);
      }
      setPageLoading(false);
    }
  }, [router]);

  const handleFetchAdmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (loggedInEmail && email.trim().toLowerCase() !== loggedInEmail.trim().toLowerCase()) {
      Swal.fire({
        icon: "warning",
        title: "Access Denied 🔒",
        text: "Aap sirf apne registered account ka Admit Card dekh sakte hain!",
        customClass: { popup: "rounded-3xl bg-white text-slate-900 border border-amber-500" }
      });
      setEmail(loggedInEmail);
      return;
    }

    setLoading(true);
    setAdmitCardData(null);

    try {
      const res = await fetch("/api/admit-cards/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await res.json();

      if (res.ok) {
        setAdmitCardData(result.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: result.error || "Aapka Admit Card nahi mila.",
          customClass: { popup: "rounded-3xl bg-white text-slate-900 border border-amber-500" }
        });
      }
    } catch (error) {
      Swal.fire({ 
        icon: "error", 
        title: "Server Error", 
        text: "Kuch galat hua. Kripya dubara koshish karein.",
        customClass: { popup: "rounded-3xl bg-white text-slate-900" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
        <RefreshCw className="animate-spin text-amber-600 mb-2" size={32} />
        <p className="font-bold text-blue-950 uppercase tracking-wider text-xs">Aapki details verify ho rahi hain...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-900 flex flex-col items-center print-wrapper">
      
      {/* SEARCH CARD */}
      <div className="w-full max-w-xl bg-white rounded-3xl border-2 border-amber-500/30 p-6 shadow-xl mb-6 print:hidden">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <FileText size={24} />
          </div>
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-600 via-amber-700 to-blue-950 bg-clip-text text-transparent tracking-wide">
            DOWNLOAD ADMIT CARD
          </h1>
          <p className="text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-300 px-3 py-1.5 rounded-lg inline-block mt-2 shadow-sm">
            Enter your email to Download admit card.
          </p>
        </div>

        <form onSubmit={handleFetchAdmitCard} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Enter your registered email address..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 focus:border-amber-500 outline-none rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-900 font-medium transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2 hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.99] disabled:opacity-50 shadow-md cursor-pointer"
          >
            {loading ? "FETCHING RECORD..." : (
              <>
                <Search size={16} /> VIEW ADMIT CARD
              </>
            )}
          </button>
        </form>
      </div>

      {/* DIGITAL ADMIT CARD VIEW */}
      {admitCardData && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn printable-area">
          
          {/* Quick Print Action Bar */}
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-3 mb-4 flex items-center justify-between shadow-md print:hidden">
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Verify all information before printing.
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800 text-xs font-bold text-white tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer size={14} /> PRINT / SAVE AS PDF
            </button>
          </div>

          {/* PRINTABLE ADMIT CARD */}
          <div className="admit-card-container w-full bg-white text-slate-900 rounded-2xl p-6 md:p-8 border-4 border-double border-amber-600 shadow-xl font-sans relative overflow-hidden print:border-2 print:border-amber-600 print:p-5 print:shadow-none print:rounded-none">
            
            {/* 🌟 Background Watermark (Adjusted Opacity & Centered) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.10] pointer-events-none select-none z-0 overflow-hidden watermark-container">
              <h1 className="text-6xl md:text-8xl font-black tracking-widest text-blue-950 -rotate-12 uppercase text-center whitespace-nowrap">
                VIRAAM VAANI
              </h1>
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-row items-center justify-between border-b-[3px] border-blue-950 pb-3 mb-4 header-section">
                <div className="flex items-center flex-1 relative">
  {/* Logo */}
  <div className="w-14 h-14 bg-slate-50 rounded-xl border-2 border-amber-500 flex items-center justify-center overflow-hidden shrink-0 shadow-sm print:w-12 print:h-12">
    <img
      src="/images/logo.jpeg"
      alt="Logo"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Center Title */}
  <div className="absolute left-1/2 -translate-x-1/2 text-center">
    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-blue-950">
      VIRAAM VAANI
    </h2>
    <p className="text-[10px] md:text-xs text-amber-600 font-bold uppercase tracking-wider">
      Official Examination Admit Card
    </p>
  </div>
</div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-blue-950 text-amber-400 text-[9px] font-black rounded-md uppercase tracking-widest border border-amber-500">
                    ORIGINAL PASS
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">Ref: <span className="font-mono text-blue-950">{admitCardData.registrationNo || 'N/A'}</span></p>
                </div>
              </div>

              {/* Photo & Details Section */}
              <div className="flex flex-row gap-4 items-start mb-4 photo-details-row">
                <div className="card-sections-wrapper flex flex-col md:flex-row gap-4 flex-grow text-xs">
                  
                  {/* Student Details */}
                  <div className="student-box flex-1 border border-slate-200 rounded-xl p-3.5 bg-slate-50/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-950"></div>
                    <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
                      Student Particulars
                    </h3>
                    <div className="space-y-1">
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Full Name:</strong> <span className="font-black text-blue-950 text-xs uppercase">{admitCardData.studentName}</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Roll Number:</strong> <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1 py-0.2 rounded">{admitCardData.rollNumber}</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Reg Number:</strong> <span className="font-medium text-slate-800 font-mono">{admitCardData.registrationNo || "—"}</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Parent Name:</strong> <span className="font-medium text-slate-800 uppercase">{admitCardData.parentName || "—"}</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Date of Birth:</strong> <span className="font-medium text-slate-800">{admitCardData.dob}</span></p>
                      <p className="flex justify-between"><strong className="text-slate-500 font-medium">Class:</strong> <span className="font-bold text-blue-950">{admitCardData.batch}</span></p>
                    </div>
                  </div>

                  {/* Exam Details */}
                  <div className="logistics-box flex-1 border border-slate-200 rounded-xl p-3.5 bg-slate-50/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <h3 className="text-[11px] font-black text-blue-950 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
                      Examination Logistics
                    </h3>
                    <div className="space-y-1">
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Exam Name:</strong> <span className="font-bold text-slate-900">{admitCardData.examName}</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Date:</strong> <span className="font-bold text-blue-950">{admitCardData.examDate} ({admitCardData.examDay})</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Time:</strong> <span className="font-semibold text-slate-800">{admitCardData.examTime}</span></p>
                      <p className="flex justify-between border-b border-slate-100 pb-0.5"><strong className="text-slate-500 font-medium">Reporting:</strong> <span className="font-bold text-rose-700 bg-rose-50 px-1 rounded">{admitCardData.reportingTime}</span></p>
                      <p className="flex justify-between"><strong className="text-slate-500 font-medium">Duration:</strong> <span className="font-medium text-slate-800">{admitCardData.duration}</span></p>
                    </div>
                  </div>

                </div>

                {/* Photo Box */}
                <div className="w-28 h-36 border-2 border-dashed border-slate-400 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-2 text-center shrink-0 photo-box-container select-none">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
                    Affix Passport Size Photograph Here
                  </span>
                  <span className="text-[8px] text-slate-400 mt-1.5 block font-medium">
                    (Self Attested)
                  </span>
                </div>
              </div>
              {/* Venue Info */}
              <div className="w-full border border-slate-200 bg-slate-50/40 rounded-xl p-3 mb-4 text-xs">
                <div className="leading-normal">
                  <strong className="text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Test Venue / परीक्षा केंद्र:</strong>
                  <span className="font-black text-blue-950 text-sm block">{admitCardData.centerName}</span>
                  <span className="text-slate-600 font-medium block mt-0.5">{admitCardData.centerAddress}</span>
                </div>
                {(admitCardData.roomNo || admitCardData.seatNo) && (
                  <div className="flex gap-6 mt-2 pt-1.5 border-t border-slate-200 font-bold text-blue-950">
                    <p>Room No: <span className="text-amber-600">{admitCardData.roomNo || "—"}</span></p>
                    <p>Seat No: <span className="text-amber-600">{admitCardData.seatNo || "—"}</span></p>
                  </div>
                )}
              </div>
              {/* Instructions */}
              <div className="border border-amber-500/40 rounded-xl p-3 bg-amber-50/30 mb-4 page-break-avoid">
                <div className="flex items-center gap-2 mb-1 border-b border-amber-500/20 pb-1">
                  <ShieldAlert className="text-amber-600 shrink-0" size={14} />
                  <h4 className="text-[11px] font-black uppercase text-amber-800 tracking-wider">महत्वपूर्ण निर्देश / Candidate Instructions</h4>
                </div>
                <ul className="list-decimal list-inside text-[10px] text-slate-700 font-semibold space-y-0.5 leading-relaxed pl-1">
                  <li> परीक्षा केंद्र पर इस <strong className="text-blue-950">Admit Card</strong> को प्रिंट कराकर साथ लाना अनिवार्य है।</li>
                  <li>परीक्षा शुरू होने के समय से कम से कम <strong>30 मिनट पहले</strong> रिपोर्टिंग समय पर केंद्र पहुंचें।</li>
                  <li>मोबाइल फोन, स्मार्ट वॉच, कैलकुलेटर या कोई भी इलेक्ट्रॉनिक उपकरण अंदर लाना सख्त निषिद्ध है।</li>
                  <li>OMR/Answer Sheet भरने के लिए केवल <strong>नीले या काले बॉलपॉइंट पेन</strong> का उपयोग करें।</li>
                  <li>किसी भी प्रकार की अनुचित साधन (Cheating) का उपयोग करने पर परीक्षा तुरंत रद्द कर दी जाएगी।</li>
                  <li>सत्यापन के लिए अपना एक वैध सरकारी <strong>पहचान पत्र (ID Proof)</strong> साथ रखें।</li>
                </ul>
              </div>
              {/* Signatures Section */}
              <div className="flex justify-between items-end pt-2 text-center text-xs text-slate-600 page-break-avoid summary-footer">
                <div>
                  <div className="w-36 border-b border-slate-400 mx-auto mb-1 h-12"></div>
                  <p className="font-semibold text-slate-700 text-[10px]">Candidate Signature</p>
                </div>
                <div className="text-center text-[9px] text-slate-400 font-mono print:block hidden">
                  Generated securely via Viraam Vaani 
                </div>
                <div>
                  {/* Authorized Signatory Box */}
                  <div className="w-44 border-b-2 border-blue-950 mx-auto mb-1 h-16 flex items-end justify-center relative pb-0.5">
                    
                    {/* 🖋️ Signature (Md Adil) */}
                    <span className="text-[17px] font-serif tracking-tight text-slate-800 italic font-black relative z-10 -mb-1 select-none">
                      Md Adil
                    </span>

                    {/* 🔴 Stamp */}
                    <div className="absolute w-36 h-36 -rotate-12 pointer-events-none select-none z-20 -top-10 -left-1 opacity-80 mix-blend-multiply">
                      <svg viewBox="0 0 200 200" className="w-full h-full text-[#b91c1c] fill-current">
                        <defs>
                          <path id="topArcFixed" d="M 30,100 A 70,70 0 1,1 170,100" />
                          <path id="bottomArcAdjusted" d="M 25,100 A 75,75 0 0,0 175,100" />
                        </defs>

                        {/* Outer Double Circle */}
                        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" />
                        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" />

                        {/* Inner Dotted Circle */}
                        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1 3.5" strokeLinecap="round" />

                        {/* Curved Top Text: ★ VIRAAM ★ */}
                        <text fontSize="13" fontWeight="900" letterSpacing="2.5" fill="currentColor">
                          <textPath href="#topArcFixed" startOffset="50%" textAnchor="middle">
                            ★ VIRAAM ★
                          </textPath>
                        </text>

                        {/* Curved Bottom Text: ★ VAANI ★ */}
                        <text fontSize="13" fontWeight="900" letterSpacing="2.5" fill="currentColor">
                          <textPath href="#bottomArcAdjusted" startOffset="50%" textAnchor="middle">
                            ★ VAANI ★
                          </textPath>
                        </text>

                        {/* Center Banner */}
                        <g>
                          <rect x="5" y="80" width="190" height="40" fill="white" fillOpacity="0.1" />
                          
                          {/* Banner Top Double Line */}
                          <line x1="5" y1="80" x2="195" y2="80" stroke="currentColor" strokeWidth="3.5" />
                          <line x1="5" y1="85" x2="195" y2="85" stroke="currentColor" strokeWidth="1.5" />
                          
                          {/* APPROVED Text */}
                          <text x="100" y="108" fontSize="23" fontWeight="900" textAnchor="middle" letterSpacing="2.5" fill="currentColor">
                            APPROVED
                          </text>

                          {/* Banner Bottom Double Line */}
                          <line x1="5" y1="115" x2="195" y2="115" stroke="currentColor" strokeWidth="1.5" />
                          <line x1="5" y1="120" x2="195" y2="120" stroke="currentColor" strokeWidth="3.5" />
                        </g>
                      </svg>
                    </div>

                  </div>
                  <p className="font-black text-blue-950 text-[10px]">Authorized Signatory</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 8mm 12mm 8mm;
          }
          
          body, html {
            background: #ffffff !important;
            color: #020617 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          .printable-area, .printable-area * {
            visibility: visible !important;
          }

          .printable-area {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print\:hidden {
            display: none !important;
          }

          .watermark-container {
            opacity: 0.06 !important;
          }

          .admit-card-container {
            border: 2px solid #d97706 !important;
            padding: 15px !important;
            box-shadow: none !important;
            border-radius: 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .photo-details-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            width: 100% !important;
          }

          .card-sections-wrapper {
            display: flex !important;
            flex-direction: row !important;
            gap: 10px !important;
            flex: 1 !important;
          }

          .student-box, .logistics-box {
            flex: 1 !important;
          }

          .photo-box-container {
            display: flex !important;
            width: 110px !important;
            height: 140px !important;
            border: 2px dashed #94a3b8 !important;
            background-color: #f8fafc !important;
          }

          .page-break-avoid {
            page-break-inside: avoid !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}