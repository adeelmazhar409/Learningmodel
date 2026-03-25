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

  /* ── Validation ── */
  function validate() {
    const e: typeof errors = {};
    if (!email.trim())               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password)                   e.password = "Password is required";
    else if (password.length < 6)   e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { user, session } = await authApi.login({ email, password });
      setUser(user);
      setSession(session);
      toast.success("Welcome back!");

      // If user hasn't completed onboarding send them there
      if (!user.grade_level) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .auth-heading {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .auth-sub {
          font-size: 14px;
          color: var(--soft);
          margin-bottom: 28px;
          font-weight: 300;
          line-height: 1.5;
        }
        .field { margin-bottom: 18px; }
        .input-error { font-size: 12px; color: var(--ember); margin-top: 5px; }
        .submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(12,12,14,0.3);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      <h1 className="auth-heading">Welcome back</h1>
      <p className="auth-sub">Sign in to continue your learning journey.</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
            className={`input${errors.email ? " error" : ""}`}
            placeholder="you@school.edu"
            disabled={loading}
          />
          {errors.email && <p className="input-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
            className={`input${errors.password ? " error" : ""}`}
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.password && <p className="input-error">{errors.password}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-p submit-btn"
          disabled={loading}
        >
          {loading
            ? <><span className="spinner" /> Signing in…</>
            : "Sign in"
          }
        </button>
      </form>

      {/* Footer link */}
      <div className="auth-footer">
        Don&apos;t have an account?{" "}
        <Link href="/signup">Create one free</Link>
      </div>
    </>
  );
}
