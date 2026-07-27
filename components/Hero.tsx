"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-blue-50" />

      {/* Blur Effects */}
      <div className="absolute top-20 left-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 py-5 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Side */}
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-bold">
              🎉 Admissions Open
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900">
              Guiding Young
              <span className="text-blue-700"> Minds </span>
              For Academic Success
            </h1>

            <div className="mt-8 relative max-w-xl rounded-2xl bg-white p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-200/80 group overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-slate-500/0 rounded-full blur-2xl pointer-events-none transition-all group-hover:scale-125 duration-500" />

              {/* Highlight Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-700 via-blue-600 to-slate-700 rounded-l-2xl" />

              <div className="space-y-3.5 relative z-10 pl-2">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border border-blue-100 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Our Educational Philosophy
                </div>

                <p className="text-[15px] md:text-base text-slate-600 font-medium leading-relaxed">
                  <strong className="text-slate-950 font-black tracking-tight text-[17px] block mb-1">
                    Viraam Vaani
                  </strong>
                  is a trusted platform where{" "}
                  <span className="text-slate-950 font-bold bg-gradient-to-r from-blue-100 to-slate-100 px-1 rounded">
                    learning goes beyond textbooks
                  </span>
                  . With expert teachers, personal care, and innovative methods,
                  we nurture young minds — helping students{" "}
                  <span className="text-blue-700 font-bold">
                    excel in studies
                  </span>{" "}
                  and grow with{" "}
                  <span className="text-slate-900 font-bold">
                    confidence for life
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {/* Admission Button */}
              <Link
                href="/admission"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                🎓 Apply For Admission
              </Link>

              {/* Demo Class Button */}
              <a
                href="https://www.youtube.com/@ViraamVaani-i8k"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-8 py-4 font-bold text-slate-900 shadow-lg transition-all duration-300 hover:bg-slate-900 hover:text-white hover:scale-105"
              >
                ▶ Watch Free Demo Class
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-3xl font-bold text-blue-700">500+</h3>
                <p className="text-slate-600">Students</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-700">5+</h3>
                <p className="text-slate-600">Years Experience</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-700">95%</h3>
                <p className="text-slate-600">Success Rate</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-700">100+</h3>
                <p className="text-slate-600">Materials</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100">
              <video
                src="/images/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
                className="w-full h-[500px] object-cover rounded-2xl bg-slate-50 shadow-inner"
              />
            </div>

            {/* Floating Cards */}
            <div className="hidden md:block absolute -left-10 top-10 bg-white rounded-2xl shadow-xl p-4 transition-transform hover:scale-105 duration-300">
              <h3 className="text-2xl font-bold text-blue-700">500+</h3>
              <p className="text-slate-600">Active Students</p>
            </div>

            <div className="hidden md:block absolute -right-10 bottom-16 bg-white rounded-2xl shadow-xl p-4 transition-transform hover:scale-105 duration-300">
              <h3 className="text-2xl font-bold text-blue-700">95%</h3>
              <p className="text-slate-600">Success Rate</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}