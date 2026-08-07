"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("loginTimestamp", Date.now().toString());

        window.location.href = "/";
      } else {
        Swal.fire({
          icon: "error",
          title: "AUTHENTICATION FAILED",
          text: data.error || "Invalid user credentials.",
          confirmButtonColor: "#1d4ed8",
          customClass: { popup: "rounded-3xl font-sans" },
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "CONNECTION ERROR",
        text: "Something went wrong while connecting to the auth hub.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl font-sans" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-sans md:grid md:grid-cols-12">
      {/* DESKTOP LEFT SIDE PANEL */}
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12 text-white md:col-span-6 md:flex">
        {/* Glow Spheres matching 'Why Choose Us' background styling */}
        <div className="pointer-events-none absolute -top-40 left-0 h-96 w-96 rounded-full bg-blue-100 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl" />

        {/* LOGO & BRAND NAME (CLICKABLE TO HOME) */}
        <Link
          href="/"
          className="group relative z-10 flex cursor-pointer flex-col items-center space-y-4 text-center"
        >
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-blue-200/30 bg-white/10 p-2 backdrop-blur-md transition-transform duration-500 group-hover:scale-105 group-hover:border-white">
            <Image
              src="/images/logo.jpeg"
              alt="Viraam Vaani Logo"
              width={96}
              height={96}
              priority
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white transition-colors group-hover:text-blue-200">
            Viraam Vaani
          </h1>
        </Link>

        {/* FOOTER COPYRIGHT */}
        <div className="absolute bottom-6 text-xs font-medium text-blue-200/70">
          © {new Date().getFullYear()} Viraam Vaani. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE PANEL / MOBILE CONTAINER */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 md:col-span-6">
        {/* ENHANCED CLOSE BUTTON (TOP-RIGHT) */}
        <Link
          href="/"
          title="Back to Home"
          className="group absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-md"
        >
          <X size={18} className="transition-transform duration-300 group-hover:rotate-90" />
        </Link>

        <div className="flex w-full max-w-sm flex-col items-center">
          {/* MOBILE LOGO DISPLAY (CLICKABLE TO HOME) */}
          <Link
            href="/"
            className="group mb-6 flex cursor-pointer flex-col items-center text-center md:hidden"
          >
            <div className="relative mb-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-blue-700">
              <Image
                src="/images/logo.jpeg"
                alt="Viraam Vaani Logo"
                width={72}
                height={72}
                priority
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
              Viraam Vaani
            </h1>
          </Link>

          {/* FORM HEADER */}
          <div className="mb-8 w-full text-center">
            
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Sign in with your email and password
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="w-full space-y-5">
            {/* EMAIL INPUT */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-blue-800 disabled:opacity-50"
            >
              <span>{isLoading ? "Validating Portal..." : "Continue"}</span>
              {!isLoading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              )}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="relative z-20 mt-8 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="inline-block cursor-pointer font-bold text-blue-700 transition-colors duration-200 hover:text-blue-900 hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* MOBILE COPYRIGHT */}
          <div className="mt-12 block text-center text-xs text-slate-400 md:hidden">
            © {new Date().getFullYear()} Viraam Vaani. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}