"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { userApi } from "@/lib/api/user.api";
import Nav from "@/components/layout/Nav";

const MOCK_USER = {
  id: "mock-user-001", name: "Alex Johnson", email: "student@school.edu",
  grade_level: 10,
  learning_profile: { practice: 0.45, teach_back: 0.28, flashcards: 0.17, visual: 0.10 },
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
};
const MOCK_SESSION = {
  access_token: "mock-access-token", refresh_token: "mock-refresh-token",
  expires_at: Date.now() / 1000 + 3600, user_id: "mock-user-001",
};

const IS_MOCK = !process.env.NEXT_PUBLIC_API_URL;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, session, setUser, setSession, setIsLoading } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      /* Mock mode — inject fake user, no backend needed */
      if (IS_MOCK) {
        if (!user) { setUser(MOCK_USER); setSession(MOCK_SESSION); }
        setIsLoading(false);
        setReady(true);
        return;
      }

      /* Real mode — check if we have a session */
      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      /* Fetch real user profile if we have a token but no user loaded yet */
      if (!user) {
        try {
          const profile = await userApi.getProfile();
          setUser(profile);
        } catch {
          /* Token is invalid or expired — send to login */
          router.replace("/login");
          return;
        }
      }

      setIsLoading(false);
      setReady(true);
    }

    init();
  }, []); // eslint-disable-line

  if (!ready) {
    return (
      <div className="min-h-svh bg-[#0c0c0e] flex items-center justify-center">
        <div className="w-9 h-9 bg-gradient-to-br from-[#e8603c] to-[#8c2410] rounded-full animate-pulse"/>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#0c0c0e] flex flex-col">
      <Nav />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
