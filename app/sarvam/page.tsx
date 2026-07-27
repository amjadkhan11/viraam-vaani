"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, X, Phone, GraduationCap, Award } from "lucide-react";

export default function SarvamPage() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Form States Control
  const [formData, setFormData] = useState({
    schoolName: "",
    principalName: "",
    studentStrength: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    reason: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sarvam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application Submitted Successfully to Database!");
        setIsFormOpen(false);
        setFormData({
          schoolName: "", principalName: "", studentStrength: "",
          email: "", phone: "", address: "", district: "", state: "", pincode: "", reason: ""
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Failed to connect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50 text-slate-800 min-h-screen selection:bg-blue-600 selection:text-white font-sans antialiased overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-slate-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50 px-6 py-12">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-5 right-1/4 w-96 h-96 bg-blue-300/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
          <div className="mb-6 flex justify-center items-center">
            <div className="relative w-40 h-40 overflow-hidden rounded-full shadow-md bg-white border border-slate-100 flex items-center justify-center">
              <Image 
                src="/images/sarvam.png"
                alt="Sarvam Viraam Vaani Logo" 
                width={160} 
                height={160}
                priority
                className="object-cover"
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-blue-900 uppercase shadow-sm">
            <Sparkles size={14} className="text-blue-700" />
            Viraam Vaani Presents
          </span>
          
          <h1 className="mt-4 text-5xl md:text-7xl font-black tracking-tight text-slate-950 bg-clip-text bg-gradient-to-b from-blue-950 via-slate-900 to-slate-800">
            SARVAM
          </h1>
          <p className="text-lg md:text-2xl font-extrabold tracking-wide mt-3 text-blue-900 max-w-2xl">
            &quot;Building Better Humans Before Better Professionals.&quot;
          </p>
          
          <p className="max-w-3xl mx-auto mt-6 text-base md:text-lg leading-relaxed text-slate-600 font-normal">
            Every year, our schools proudly send hundreds of students into the world. Some become doctors. Some become teachers. Some become engineers. Some become police officers. Some become civil servants. But before becoming any profession, <strong>they first become human beings</strong>. The decisions they make throughout their lives will not be shaped only by what they studied in textbooks, but by the values, character, judgement and sense of responsibility they develop during their school years.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => setIsFormOpen(true)}
              className="group relative bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 hover:from-blue-900 hover:to-slate-950 text-white px-6 py-3 rounded-xl font-extrabold transition-all duration-300 shadow-lg shadow-blue-950/20 flex items-center justify-center overflow-hidden"
            >
              Apply Now
            </button>
            <Link
              href="/"
              className="border border-slate-200 hover:border-blue-900/40 bg-white hover:bg-slate-50 text-blue-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm"
            >
              Explore Viraam Vaani
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION & CORE IDENTITY */}
      <section className="max-w-7xl mx-auto px-6 py-14 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-blue-900 font-bold uppercase tracking-widest text-sm">About Sarvam</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-slate-950">What is SARVAM?</h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              SARVAM is a long-term educational initiative that works alongside schools to help nurture a generation of students who are academically capable, emotionally balanced, ethically responsible, environmentally conscious, culturally rooted and civically aware.
            </p>
            <p className="mt-3 text-slate-600 text-base leading-relaxed font-semibold text-blue-900">
              &quot;Education prepares children for a career. Character prepares them for life. Let us build both.&quot;
            </p>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 mt-5 max-w-xl">
              <p className="text-sm text-slate-900 font-medium italic leading-relaxed">
                📢 <strong>Our Vision:</strong> &quot;We are not trying to make our village famous. We are trying to make it worthy of being followed.&quot; Our dream is to make our village an example of what becomes possible when schools, teachers, parents and students work together with a shared vision.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-2 bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 pl-4">What We Are NOT:</div>
            {[
              { title: "Not Another Motivational Seminar", desc: "It is not another motivational seminar. We focus on consistent, structured ecosystem building, not temporary hype." },
              { title: "Not Coaching or Tuition", desc: "It is not coaching. It is not tuition. We do not teach textbook curriculum or prepare students for regular exams." },
              { title: "Not A Personality Development Programme", desc: "It is not a personality development programme. We work deeply on core ethics, judgment, and life character development." }
            ].map((card, idx) => (
              <div key={idx} className="flex gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-900/30 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-900/50 transition-colors">
                  <X className="text-red-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-950 group-hover:text-blue-900 transition-colors">{card.title}</h3>
                  <p className="text-slate-500 mt-1 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILOT SESSION CALLOUT */}
      <section className="border-t border-slate-200 bg-blue-950 text-white py-14 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-blue-200 font-bold uppercase tracking-widest text-xs bg-blue-900/50 px-3 py-1 rounded-full border border-blue-400/20">Exclusive Pilot Program</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">One Saturday. One Session. One Opportunity.</h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            We humbly request an opportunity to conduct <strong>one pilot session</strong> for the students of <strong>Classes VI-X</strong>. There are no fees, no advertisements, no commercial interests, and no obligation to continue if the school does not find genuine value in the programme.
          </p>
          <div className="mt-6 inline-flex flex-wrap justify-center gap-6 text-xs md:text-sm font-semibold text-blue-200">
            <div className="flex items-center gap-1.5">✓ Zero Commercial Interest</div>
            <div className="flex items-center gap-1.5">✓ Completely Free Pilot</div>
            <div className="flex items-center gap-1.5">✓ Purely Character Driven</div>
          </div>
        </div>
      </section>

      {/* WHY JOIN SECTION */}
      <section className="py-14 relative border-t border-slate-200 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-blue-900 font-bold uppercase tracking-widest text-sm">Founding Institutions</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Why Partner With SARVAM?</h2>
            <p className="mt-2 text-slate-600 text-base">
              We seek visionary schools willing to become the Founding Schools of this initiative to rebuild the future inside classrooms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-900/20 transition-colors">
              <h3 className="text-xl font-bold text-blue-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <GraduationCap className="text-blue-800" size={22} /> For Students
              </h3>
              <ul className="space-y-3 mt-4 text-slate-600 text-sm md:text-base">
                {[
                  "Academically Capable",
                  "Emotionally Balanced",
                  "Ethically Responsible",
                  "Environmentally Conscious",
                  "Culturally Rooted & Civically Aware"
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span> {li}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-900/20 transition-colors">
              <h3 className="text-xl font-bold text-blue-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="text-blue-800" size={22} /> For Visionary Schools
              </h3>
              <ul className="space-y-3 mt-4 text-slate-600 text-sm md:text-base">
                {[
                  "Become one of the Founding Schools of this initiative",
                  "Work alongside a long-term educational framework",
                  "Co-nurture a generation of character and academic excellence",
                  "Help schools, teachers, parents, and students work together",
                  "Set an example of transformation inside classrooms"
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span> {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP / JOURNEY */}
      <section className="py-14 relative border-t border-slate-200 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-blue-900 font-bold uppercase tracking-widest text-sm">Growth Journey</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Our Strategy</h2>
            <p className="mt-2 text-slate-600 text-base leading-relaxed">
              We believe that the future of any village, town or nation is built inside its classrooms. Here is how we build this vision:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { phase: "1", title: "Our Own Village", text: "Our journey begins from our own village because every great transformation starts somewhere." },
              { phase: "2", title: "Model Example", text: "Our dream is to make our village an example of what becomes possible with a shared vision." },
              { phase: "3", title: "Collective Synergy", text: "To create an active ecosystem where schools, teachers, parents and students work together." },
              { phase: "4", title: "Nationwide Benchmark", text: "If people across India look at our village as a model of education, character and responsible citizenship." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-slate-200 border-t-blue-900 border-t-4 rounded-xl p-6 shadow-sm transition-all duration-300 hover:border-blue-800">
                <span className="text-xs font-bold tracking-widest text-blue-900 uppercase">Phase {step.phase}</span>
                <h3 className="font-bold text-lg mt-1 text-slate-950">{step.title}</h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 relative border-t border-slate-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 text-center px-6">
        <div className="relative max-w-4xl mx-auto z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">Bring SARVAM To Your School</h2>
          <p className="mt-4 text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            If the vision resonates with your institution, it would be an honour to present the complete framework personally at your convenience.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 hover:from-blue-900 hover:to-slate-950 text-white px-6 py-3 rounded-xl font-extrabold transition-all duration-300 shadow-md shadow-blue-950/10"
            >
              Request Session
            </button>
            <a
              href="tel:+919304024338"
              className="border border-slate-200 hover:border-blue-900/40 bg-white hover:bg-slate-50 text-blue-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm flex items-center gap-2"
            >
              <Phone size={16} className="text-blue-800" />
              Contact Us: +91 9304024338
            </a>
          </div>

          {/* SIGNATURE SIGN OFF */}
          <div className="mt-12 border-t border-slate-200 pt-6 inline-block text-left">
            <p className="text-sm font-bold text-slate-950">With sincere regards,</p>
            <p className="text-base font-black text-blue-900 mt-0.5">MD Adil</p>
            <p className="text-xs font-semibold text-slate-500">Founder - Viraam Vaani</p>
            <p className="text-xs text-slate-400">Initiative - SARVAM</p>
          </div>
        </div>
      </section>

      {/* ================= MODAL / POPUP FORM ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col relative max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-slate-950">SARVAM Application Form</h3>
                <p className="text-xs text-slate-500 mt-0.5">Please fill in the institution details below.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">School / College Name</label>
                <input required type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange} placeholder="Enter school/college name" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Principal Name</label>
                  <input required type="text" name="principalName" value={formData.principalName} onChange={handleInputChange} placeholder="Enter principal name" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Student Strength</label>
                  <input required type="number" name="studentStrength" value={formData.studentStrength} onChange={handleInputChange} placeholder="e.g. 500" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="principal@school.com" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Phone</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit number" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
              </div>

              {/* FULL ADDRESS FIELD */}
              <div>
                <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Full Institution Address</label>
                <textarea required rows={2} name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter complete postal address of the school/college" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50 resize-none"></textarea>
              </div>

              {/* DISTRICT, STATE & PINCODE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">District</label>
                  <input required type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Pincode</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} pattern="[0-9]{6}" maxLength={6} placeholder="6-digits" className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Why do you want SARVAM?</label>
                <textarea required rows={2} name="reason" value={formData.reason} onChange={handleInputChange} placeholder="Tell us how SARVAM can help your institution..." className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-700 transition-colors bg-slate-50/50 resize-none"></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 hover:from-blue-900 hover:to-slate-950 text-white p-3 rounded-xl font-bold transition-all duration-300 shadow-md shadow-blue-950/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}