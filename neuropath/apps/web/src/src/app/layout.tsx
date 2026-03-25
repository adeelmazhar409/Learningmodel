"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser, setSession, setIsLoading } = useAuthStore();
  useEffect(() => {
    if (!user) { setUser(MOCK_USER); setSession(MOCK_SESSION); }
    setIsLoading(false);
  }, [user, setUser, setSession, setIsLoading]);

  return (
    <div className="min-h-svh bg-[#0c0c0e] flex flex-col">
      <Nav />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
