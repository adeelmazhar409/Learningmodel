"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  /* ── Validation ── */
  function validate() {
    const e: typeof errors = {};
    if (!name.trim())                      e.name     = "Name is required";
    if (!email.trim())                     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email";
    if (!password)                         e.password = "Password is required";
    else if (password.length < 8)         e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { user, session } = await authApi.signup({ name, email, password });
      setUser(user);
      setSession(session);
      toast.success("Account created! Let's set up your profile.");
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not create account. Try again.";
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
        .field         { margin-bottom: 18px; }
        .input-error   { font-size: 12px; color: var(--ember); margin-top: 5px; }
        .submit-btn    { width: 100%; justify-content: center; margin-top: 8px; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(12,12,14,0.3);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        .terms {
          font-size: 11.5px;
          color: var(--whisper);
          text-align: center;
          margin-top: 14px;
          line-height: 1.5;
        }
        .terms a {
          color: var(--soft);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>

      <h1 className="auth-heading">Create your account</h1>
      <p className="auth-sub">
        Free to start. No credit card required.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="field">
          <label className="label" htmlFor="name">Your name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })); }}
            className={`input${errors.name ? " error" : ""}`}
            placeholder="Alex Johnson"
            disabled={loading}
          />
          {errors.name && <p className="input-error">{errors.name}</p>}
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
            className={`input${errors.password ? " error" : ""}`}
            placeholder="Min. 8 characters"
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
            ? <><span className="spinner" /> Creating account…</>
            : "Create free account"
          }
        </button>

        <p className="terms">
          By signing up you agree to our{" "}
          <a href="/terms">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>

      {/* Footer link */}
      <div className="auth-footer">
        Already have an account?{" "}
        <Link href="/login">Sign in</Link>
      </div>
    </>
  );
}
