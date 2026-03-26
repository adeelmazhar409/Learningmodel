"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/auth.store";
import { authApi } from "../../../lib/api/auth.api";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
function IcUser({ s = 15 }: { s?: number }) {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
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

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

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
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function inputCls(hasErr?: string) {
    return [
      "w-full bg-surface border rounded-xl pl-10 pr-4 py-3.5 text-[14px] text-text outline-none font-sans",
      "placeholder:text-whisper transition-all duration-200",
      hasErr
        ? "border-[rgba(239,68,68,0.6)] focus:border-[rgba(239,68,68,0.8)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
        : "border-edge focus:border-[rgba(217,79,43,0.5)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.09)]",
    ].join(" ");
  }

  const fields = [
    {
      id: "name",
      label: "Your name",
      type: "text",
      val: name,
      set: setName,
      ac: "name",
      ph: "Alex Johnson",
      icon: <IcUser />,
      err: errors.name,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      val: email,
      set: setEmail,
      ac: "email",
      ph: "you@school.edu",
      icon: <IcMail />,
      err: errors.email,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      val: password,
      set: setPassword,
      ac: "new-password",
      ph: "Min. 8 characters",
      icon: <IcLock />,
      err: errors.password,
    },
  ] as const;

  return (
    <>
      <h1 className="font-serif text-[24px] sm:text-[26px] font-medium text-text tracking-[-0.02em] leading-tight mb-1.5">
        Create your account
      </h1>
      <p className="text-[13.5px] text-soft font-light mb-7">
        Free to start. No credit card required.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.id} className="flex flex-col gap-1.5">
            <label
              htmlFor={f.id}
              className="text-[10.5px] font-semibold text-soft tracking-[0.08em] uppercase"
            >
              {f.label}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-whisper pointer-events-none">
                {f.icon}
              </div>
              <input
                id={f.id}
                type={f.type}
                autoComplete={f.ac}
                value={f.val}
                onChange={(e) => {
                  (f.set as (v: string) => void)(e.target.value);
                  setErrors((v) => ({ ...v, [f.id]: undefined }));
                }}
                className={inputCls(f.err)}
                placeholder={f.ph}
                disabled={loading}
              />
            </div>
            {f.err && (
              <p className="text-[11.5px] text-red-400 font-medium">{f.err}</p>
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-text text-ink rounded-full py-3.5 text-[14px] font-semibold mt-1 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-ink rounded-full animate-spin shrink-0" />
              Creating account…
            </>
          ) : (
            "Create free account"
          )}
        </button>

        <p className="text-[11.5px] text-whisper text-center leading-relaxed">
          By signing up you agree to our{" "}
          <a
            href="/terms"
            className="text-soft no-underline hover:text-text transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-soft no-underline hover:text-text transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>

      <div className="mt-7 text-center text-[13px] text-whisper">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-ember font-semibold no-underline hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}
