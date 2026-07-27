"use client";

import Link from "next/link";
import Image from "next/image"; 
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 relative border-t border-slate-200 font-sans overflow-hidden">

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-80 pointer-events-none" />
      
      {/* Ambient glows */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Footer Wrapper */}
      <div className="relative max-w-7xl mx-auto px-6 py-6 md:py-8 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* COL 1: LOGO, ABOUT & SOCIALS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                <Image 
                  src="/images/logo.jpeg" 
                  alt="Viraam Vaani Logo" 
                  width={36} 
                  height={36} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight leading-none text-slate-900">
                  Viraam Vaani
                </h3>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              Viraam Vaani is a center of learning and growth, nurturing students with knowledge, values, and innovation to build a brighter future.
            </p>

            {/* Social boxes */}
            <div className="flex items-center gap-2 pt-0.5">
              {[
                { icon: <FaFacebookF size={12} />, href: "#", bgClass: "bg-[#1877f2] text-white border-[#1877f2] hover:bg-[#145dbf] hover:border-[#145dbf]" },
                { icon: <FaInstagram size={13} />, href: "#", bgClass: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white border-transparent hover:opacity-90" },
                { icon: <FaYoutube size={13} />, href: "#", bgClass: "bg-[#ff0000] text-white border-[#ff0000] hover:bg-[#cc0000] hover:border-[#cc0000]" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 ${social.bgClass} shadow-sm hover:shadow-md hover:-translate-y-0.5`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 pb-1 border-b border-slate-200 w-fit pr-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm font-medium text-slate-600">
              {[
                { label: "Home", path: "/" },
                { label: "Admission", path: "/admission" },
                { label: "Study Material", path: "/study-material" },
                { label: "Notifications", path: "/notifications" },
                { label: "About Us", path: "/about" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    className="hover:text-blue-600 transition-colors duration-150 relative group flex items-center w-fit py-0.5"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: CONTACT INFO */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 pb-1 border-b border-slate-200 w-fit pr-4">
              Connect With Us
            </h4>
            <div className="space-y-3 text-xs md:text-sm font-medium text-slate-600">
              {/* Phone icon box */}
              <a
                href="tel:+919304024338"
                className="flex items-center gap-3 hover:text-blue-600 transition-colors group w-fit"
              >
                <div className="w-7.5 h-7.5 rounded-lg bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10">
                  <Phone size={12} />
                </div>
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">+91 9304024338</span>
              </a>

              {/* Mail icon box */}
              <a
                href="mailto:viraamvaani1@gmail.com"
                className="flex items-center gap-3 hover:text-blue-600 transition-colors group w-fit"
              >
                <div className="w-7.5 h-7.5 rounded-lg bg-green-600 text-white flex items-center justify-center group-hover:bg-green-700 transition-all shadow-md shadow-green-600/10">
                  <Mail size={12} />
                </div>
                <span className="break-all text-slate-600 group-hover:text-slate-900 transition-colors">viraamvaani000@gmail.com</span>
              </a>

              {/* Location icon box */}
              <div className="flex items-start gap-3 group w-fit">
                <div className="w-7.5 h-7.5 rounded-lg bg-blue-900 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/10">
                  <MapPin size={12} />
                </div>
                <span className="leading-normal text-slate-600">
                  Chausa, Buxar<br />
                  <span className="text-slate-500 font-normal">Bihar, India 802114</span>
                </span>
              </div>
            </div>
          </div>

          {/* COL 4: HIGH-CONTRAST HERO CTA BOX */}
          <div>
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full min-h-[175px] group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />

              <div>
                <h4 className="text-xs md:text-sm font-bold tracking-tight flex items-center gap-2 text-slate-900">
                  Admissions Open
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                </h4>

                <p className="mt-1.5 text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">
                  Limited seats available for the upcoming batch. <span className="text-blue-600 font-semibold">Enroll today</span> to secure your future.
                </p>
              </div>

              <Link
                href="/admission"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-blue-900 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm transform active:scale-[0.98]"
              >
                Apply Online
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM RIGHTS SUB-FOOTER */}
      <div className="border-t border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center">
          <p className="text-slate-500 text-[11px] font-medium text-center">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-900 font-bold">Viraam Vaani</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}