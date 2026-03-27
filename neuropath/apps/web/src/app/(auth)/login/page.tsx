"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim())               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password)                   e.password = "Password is required";
    else if (password.length < 6)   e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, session } = await authApi.login({ email, password });
      setUser(user); setSession(session);
      toast.success("Welcome back!");
      router.push(!user.grade_level ? "/onboarding" : "/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password");
    } finally { setLoading(false); }
  }

  return (
    <>
      <h1 className="font-serif text-[26px] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight mb-1.5">Welcome back</h1>
      <p className="text-sm text-[rgba(240,237,232,0.55)] font-light mb-7">Sign in to continue your learning journey.</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label className="block text-[11px] font-medium text-[rgba(240,237,232,0.55)] tracking-[0.04em] uppercase mb-2" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={email}
            onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
            className={`w-full bg-[#141418] border rounded-xl px-4 py-3 text-sm text-[#f0ede8] font-sans outline-none transition-all placeholder:text-[rgba(240,237,232,0.25)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.08)] ${errors.email ? "border-[rgba(217,79,43,0.7)]" : "border-[rgba(255,255,255,0.07)] focus:border-[rgba(217,79,43,0.5)]"}`}
            placeholder="you@school.edu" disabled={loading}/>
          {errors.email && <p className="text-xs text-[#e8603c] mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[rgba(240,237,232,0.55)] tracking-[0.04em] uppercase mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password}
            onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
            className={`w-full bg-[#141418] border rounded-xl px-4 py-3 text-sm text-[#f0ede8] font-sans outline-none transition-all placeholder:text-[rgba(240,237,232,0.25)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.08)] ${errors.password ? "border-[rgba(217,79,43,0.7)]" : "border-[rgba(255,255,255,0.07)] focus:border-[rgba(217,79,43,0.5)]"}`}
            placeholder="••••••••" disabled={loading}/>
          {errors.password && <p className="text-xs text-[#e8603c] mt-1">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium mt-1 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
          {loading ? <><span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.3)] border-t-[#0c0c0e] rounded-full animate-spin shrink-0"/>Signing in…</> : "Sign in"}
        </button>
      </form>
      <p className="text-center text-[13px] text-[rgba(240,237,232,0.25)] mt-7">
        Don&apos;t have an account? <Link href="/signup" className="text-[#e8603c] font-medium no-underline hover:opacity-80">Create one free</Link>
      </p>
    </>
  );
}
