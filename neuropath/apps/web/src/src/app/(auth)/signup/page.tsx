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
    else if (password.length < 8)         e.password = "Password must be at least 8 characters";
    setErrors(e); return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, session } = await authApi.signup({ name, email, password });
      setUser(user); setSession(session);
      toast.success("Account created! Let's set up your profile.");
      router.push("/onboarding");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not create account.");
    } finally { setLoading(false); }
  }

  const inputClass = (err?: string) => `w-full bg-[#141418] border rounded-xl px-4 py-3 text-sm text-[#f0ede8] font-sans outline-none transition-all placeholder:text-[rgba(240,237,232,0.25)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.08)] ${err ? "border-[rgba(217,79,43,0.7)]" : "border-[rgba(255,255,255,0.07)] focus:border-[rgba(217,79,43,0.5)]"}`;

  return (
    <>
      <h1 className="font-serif text-[26px] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight mb-1.5">Create your account</h1>
      <p className="text-sm text-[rgba(240,237,232,0.55)] font-light mb-7">Free to start. No credit card required.</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {[
          { id:"name",     label:"Your name",  type:"text",     val:name,     set:setName,     ac:"name",        ph:"Alex Johnson",      err:errors.name },
          { id:"email",    label:"Email",       type:"email",    val:email,    set:setEmail,    ac:"email",       ph:"you@school.edu",    err:errors.email },
          { id:"password", label:"Password",    type:"password", val:password, set:setPassword, ac:"new-password",ph:"Min. 8 characters", err:errors.password },
        ].map(f => (
          <div key={f.id}>
            <label className="block text-[11px] font-medium text-[rgba(240,237,232,0.55)] tracking-[0.04em] uppercase mb-2" htmlFor={f.id}>{f.label}</label>
            <input id={f.id} type={f.type} autoComplete={f.ac} value={f.val}
              onChange={e => { f.set(e.target.value); setErrors(v => ({ ...v, [f.id]: undefined })); }}
              className={inputClass(f.err)} placeholder={f.ph} disabled={loading}/>
            {f.err && <p className="text-xs text-[#e8603c] mt-1">{f.err}</p>}
          </div>
        ))}
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium mt-1 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
          {loading ? <><span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.3)] border-t-[#0c0c0e] rounded-full animate-spin shrink-0"/>Creating account…</> : "Create free account"}
        </button>
        <p className="text-[11.5px] text-[rgba(240,237,232,0.25)] text-center">
          By signing up you agree to our <a href="/terms" className="text-[rgba(240,237,232,0.55)] underline underline-offset-2">Terms</a> and <a href="/privacy" className="text-[rgba(240,237,232,0.55)] underline underline-offset-2">Privacy Policy</a>.
        </p>
      </form>
      <p className="text-center text-[13px] text-[rgba(240,237,232,0.25)] mt-7">
        Already have an account? <Link href="/login" className="text-[#e8603c] font-medium no-underline hover:opacity-80">Sign in</Link>
      </p>
    </>
  );
}
