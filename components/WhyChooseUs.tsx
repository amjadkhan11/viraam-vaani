"use client";

import {
  Heart,
  Lightbulb,
  Trophy,
  Handshake,
  Users,
  Brain,
} from "lucide-react";

const features = [
  {
    title: "Passion",
    description:
      "We teach with fire, commitment, and love for growth— inspiring every student to find purpose in learning.",
    icon: Heart,
  },
  {
    title: "Innovation",
    description:
      "We challenge old methods and create new ways to learn, lead, and live with clarity and confidence.",
    icon: Lightbulb,
  },
  {
    title: "Excellence",
    description:
      "We strive for excellence in every detail—from teaching to testing and from ideas to transformation.",
    icon: Trophy,
  },
  {
    title: "Collaboration",
    description:
      "We believe success is collective. Together, we grow stronger, wiser, and unstoppable.",
    icon: Handshake,
  },
  {
    title: "Community",
    description:
      "Viraam Vaani is a family where minds learn, hearts connect, and dreams take shape.",
    icon: Users,
  },
  {
    title: "Creativity",
    description:
      "We encourage imagination because true intelligence grows when ideas flow freely.",
    icon: Brain,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-0 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-50" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-blue-200 blur-3xl opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
            VIRAAM VAANI
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Why{" "}
            <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent">
              Viraam Vaani
            </span>{" "}
            ?
          </h2>

          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-blue-700" />

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
            We provide the perfect environment for academic excellence through
            innovative teaching, experienced mentors, and a student-first
            approach that empowers every learner to achieve success.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 pt-14 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-blue-200 hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:border-blue-700 group-hover:bg-blue-700">
                    <Icon className="h-9 w-9 text-blue-700 transition-colors duration-500 group-hover:text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-center text-xl font-bold text-slate-900 md:text-2xl">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-center text-sm leading-7 text-slate-600 md:text-base">
                  {item.description}
                </p>

                {/* Hover Line */}
                <div className="mx-auto mt-8 h-1 w-0 rounded-full bg-blue-700 transition-all duration-500 group-hover:w-20"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}