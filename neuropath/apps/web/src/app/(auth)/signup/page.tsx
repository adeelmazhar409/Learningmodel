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
  const [errors,   setErrors]   = useState<{ name?: string; email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim())                      e.name     = "Name is required";
    if (!email.trim())                     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email";
    if (!password)                         e.password = "Password is required";
    else if (password.length < 8)          e.password = "Password must be at least 8 characters";
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
      toast.error(err instanceof Error ? err.message : "Could not create account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (err?: string) => `input ${err ? "error" : ""}`;

  const fields = [
    { id: "name",     label: "Your name", type: "text",     val: name,     set: setName,     ac: "name",         ph: "Alex Johnson",       err: errors.name },
    { id: "email",    label: "Email",      type: "email",    val: email,    set: setEmail,    ac: "email",        ph: "you@school.edu",     err: errors.email },
    { id: "password", label: "Password",   type: "password", val: password, set: setPassword, ac: "new-password", ph: "Min. 8 characters",  err: errors.password },
  ];

  return (
    <>
      <h1 className="font-serif text-[26px] font-medium text-text tracking-[-0.02em] leading-tight mb-1.5">
        Create your account
      </h1>
      <p className="text-sm text-soft font-light mb-7">
        Free to start. No credit card required.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {fields.map(f => (
          <div key={f.id} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-whisper tracking-[0.06em] uppercase" htmlFor={f.id}>
              {f.label}
            </label>
            <input
              id={f.id}
              type={f.type}
              autoComplete={f.ac}
              value={f.val}
              onChange={e => { f.set(e.target.value); setErrors(v => ({ ...v, [f.id]: undefined })); }}
              className={inputCls(f.err)}
              placeholder={f.ph}
              disabled={loading}
            />
            {f.err && <p className="text-xs text-ember mt-0.5">{f.err}</p>}
          </div>
        ))}

        <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
              Creating account…
            </>
          ) : (
            "Create free account"
          )}
        </button>

        <p className="text-xs text-whisper text-center leading-relaxed">
          By signing up you agree to our{" "}
          <a href="/terms" className="text-soft no-underline hover:text-text transition-colors">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="text-soft no-underline hover:text-text transition-colors">Privacy Policy</a>.
        </p>
      </form>

      <div className="mt-7 text-center text-[13px] text-whisper">
        Already have an account?{" "}
        <Link href="/login" className="text-ember no-underline font-medium hover:opacity-80 transition-opacity">
          Sign in
        </Link>
      </div>
    </>
  );
}
