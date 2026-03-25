"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { userApi } from "@/lib/api/user.api";
import toast from "react-hot-toast";

const GRADES = [
  { value: 5,  label: "Grade 5",  sub: "Age 10–11" },
  { value: 6,  label: "Grade 6",  sub: "Age 11–12" },
  { value: 7,  label: "Grade 7",  sub: "Age 12–13" },
  { value: 8,  label: "Grade 8",  sub: "Age 13–14" },
  { value: 9,  label: "Grade 9",  sub: "Age 14–15" },
  { value: 10, label: "Grade 10", sub: "Age 15–16" },
  { value: 11, label: "Grade 11", sub: "Age 16–17" },
  { value: 12, label: "Grade 12", sub: "Age 17–18" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [loading,  setLoading]  = useState(false);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    try {
      const updated = await userApi.updateProfile({ grade_level: selected });
      setUser(updated); toast.success("Profile saved!");
      router.push("/diagnostic");
    } catch { toast.error("Could not save your grade. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100svh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[600px]">
        <p className="flex items-center gap-2 text-[11px] font-medium text-[#d94f2b] tracking-[2px] uppercase mb-4 before:block before:w-[18px] before:h-px before:bg-[#d94f2b]">Step 1 of 2</p>
        <h1 className="font-serif text-[clamp(28px,4vw,40px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-[1.15] mb-3">
          Welcome, {firstName}.<br/>
          <em className="italic text-[rgba(240,237,232,0.65)]">What grade are you in?</em>
        </h1>
        <p className="text-[15px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed mb-10 max-w-[480px]">
          This helps us select the right diagnostic topics — ones you haven&apos;t studied yet, so your results are accurate.
        </p>

        <div className="grid grid-cols-4 gap-2.5 mb-9 max-[500px]:grid-cols-2">
          {GRADES.map(g => (
            <button key={g.value} type="button" onClick={() => setSelected(g.value)}
              className={`relative overflow-hidden bg-[#141418] border rounded-xl py-[18px] px-3 text-center cursor-pointer transition-all hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)] hover:-translate-y-0.5
                ${selected === g.value ? "border-[rgba(217,79,43,0.55)] bg-[rgba(217,79,43,0.08)] -translate-y-0.5" : "border-[rgba(255,255,255,0.07)]"}`}>
              {selected === g.value && <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#d94f2b] to-transparent"/>}
              <div className={`font-serif text-base font-semibold mb-0.5 ${selected === g.value ? "text-[#e8603c]" : "text-[#f0ede8]"}`}>{g.label}</div>
              <div className="text-[11px] text-[rgba(240,237,232,0.25)] tracking-[0.03em]">{g.sub}</div>
            </button>
          ))}
        </div>

        <button onClick={handleContinue} disabled={!selected || loading}
          className="w-full flex items-center justify-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
          {loading ? <><span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.3)] border-t-[#0c0c0e] rounded-full animate-spin"/>Saving…</> : "Continue to Diagnostic →"}
        </button>
        <p className="text-xs text-[rgba(240,237,232,0.25)] text-center mt-4">You can change your grade later in your profile settings.</p>
      </div>
    </div>
  );
}
