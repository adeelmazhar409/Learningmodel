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
    if (!email.trim())                     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email";
    if (!password)                         e.password = "Password is required";
    else if (password.length < 6)          e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, session } = await authApi.login({ email, password });
      setUser(user);
      setSession(session);
      toast.success("Welcome back!");
      router.push(user.grade_level ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (err?: string) =>
    `input ${err ? "error" : ""}`;

  return (
    <>
      <h1 className="font-serif text-[26px] font-medium text-text tracking-[-0.02em] leading-tight mb-1.5">
        Welcome back
      </h1>
      <p className="text-sm text-soft font-light mb-7">
        Sign in to continue where you left off.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-whisper tracking-[0.06em] uppercase" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
            className={inputCls(errors.email)}
            placeholder="you@school.edu"
            disabled={loading}
          />
          {errors.email && <p className="text-xs text-ember mt-0.5">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-whisper tracking-[0.06em] uppercase" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
            className={inputCls(errors.password)}
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.password && <p className="text-xs text-ember mt-0.5">{errors.password}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="mt-7 text-center text-[13px] text-whisper">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-ember no-underline font-medium hover:opacity-80 transition-opacity">
          Create one free
        </Link>
      </div>
    </>
  );
}
