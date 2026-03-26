"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Nav from "@/components/layout/Nav";

const MOCK_USER = {
  id: "mock-user-001",
  name: "Alex Johnson",
  email: "student@school.edu",
  grade_level: 10,
  learning_profile: { practice: 0.45, teach_back: 0.28, flashcards: 0.17, visual: 0.10 },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_SESSION = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() / 1000 + 3600,
  user_id: "mock-user-001",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, session, isLoading, setUser, setSession, setIsLoading } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    /* In mock mode, seed a demo user */
    if (!process.env.NEXT_PUBLIC_API_URL) {
      if (!user) {
        setUser(MOCK_USER);
        setSession(MOCK_SESSION);
      }
      setIsLoading(false);
      return;
    }

    /* If not loading and no session, redirect to login */
    if (!isLoading && !session) {
      router.replace(`/login?from=${pathname}`);
    }
  }, [hydrated, user, session, isLoading, setUser, setSession, setIsLoading, router, pathname]);

  if (!hydrated) return null;

  return (
    <div className="min-h-svh bg-ink flex flex-col">
      <Nav />
      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
