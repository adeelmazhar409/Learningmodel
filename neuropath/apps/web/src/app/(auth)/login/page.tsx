/* ═══════════════════════════════════════════════════════════
   FILE A  →  src/app/(auth)/login/page.tsx
   ─────────────────────────────────────────────────────────
   Copy everything between the FILE A markers into that path.
═══════════════════════════════════════════════════════════ */

// ── FILE A START ──
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/auth.store";
import { authApi } from "../../../lib/api/auth.api";
import toast from "react-hot-toast";

function IcMail({ s = 15 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IcLock({ s = 15 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
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
      toast.error(
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* shared input class */
  function inputCls(hasErr?: string) {
    return [
      "w-full bg-surface border rounded-xl pl-10 pr-4 py-3.5 text-[14px] text-text outline-none font-sans",
      "placeholder:text-whisper transition-all duration-200",
      hasErr
        ? "border-[rgba(239,68,68,0.6)] focus:border-[rgba(239,68,68,0.8)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
        : "border-edge focus:border-[rgba(217,79,43,0.5)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.09)]",
    ].join(" ");
  }

  return (
    <>
      <h1 className="font-serif text-[24px] sm:text-[26px] font-medium text-text tracking-[-0.02em] leading-tight mb-1.5">
        Welcome back
      </h1>
      <p className="text-[13.5px] text-soft font-light mb-7">
        Sign in to continue your learning journey.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[10.5px] font-semibold text-soft tracking-[0.08em] uppercase"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-whisper pointer-events-none">
              <IcMail />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((v) => ({ ...v, email: undefined }));
              }}
              className={inputCls(errors.email)}
              placeholder="you@school.edu"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-[11.5px] text-red-400 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-[10.5px] font-semibold text-soft tracking-[0.08em] uppercase"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-whisper pointer-events-none">
              <IcLock />
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((v) => ({ ...v, password: undefined }));
              }}
              className={inputCls(errors.password)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          {errors.password && (
            <p className="text-[11.5px] text-red-400 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-text text-ink rounded-full py-3.5 text-[14px] font-semibold mt-1 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-ink rounded-full animate-spin shrink-0" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="mt-7 text-center text-[13px] text-whisper">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-ember font-semibold no-underline hover:opacity-80 transition-opacity"
        >
          Create one free
        </Link>
      </div>
    </>
  );
}
// ── FILE A END ──
