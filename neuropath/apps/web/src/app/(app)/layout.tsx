"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Nav from "@/components/layout/Nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, session, isLoading, setUser, setSession, setIsLoading } = useAuthStore();

  /* ── Wait for Zustand to rehydrate from localStorage ── */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist rehydrates synchronously on the client.
    // We just need one render cycle to pick it up.
    setHydrated(true);
  }, []);

  /* ── In mock mode, auto-create a session if none exists ── */
  useEffect(() => {
    if (!hydrated) return;
    if (session && user) return;

    const isMock = !process.env.NEXT_PUBLIC_API_URL;
    if (isMock) {
      // Silently set a mock session so the guard never fires
      setUser({
        id:               "mock-user-001",
        name:             "Alex Johnson",
        email:            "student@school.edu",
        grade_level:      10,
        learning_profile: {
          practice:   0.45,
          teach_back: 0.28,
          flashcards: 0.17,
          visual:     0.10,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setSession({
        access_token:  "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_at:    Date.now() / 1000 + 3600,
        user_id:       "mock-user-001",
      });
      setIsLoading(false);
      return;
    }

    // Real mode — no session means redirect to login
    setIsLoading(false);
  }, [hydrated, session, user, setUser, setSession, setIsLoading]);

  /* ── Auth guard — only runs after hydration ── */
  useEffect(() => {
    if (!hydrated || isLoading) return;
    const isMock = !process.env.NEXT_PUBLIC_API_URL;
    if (isMock) return; // mock mode never redirects

    if (!session || !user) {
      router.replace("/login");
      return;
    }
    if (!user.grade_level && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [hydrated, isLoading, session, user, pathname, router]);

  /* ── Loading state ── */
  const showLoading = !hydrated || isLoading;

  if (showLoading) {
    return (
      <div className="app-loading">
        <style>{`
          .app-loading {
            min-height: 100svh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--ink);
          }
          .app-loading-orb {
            width: 36px;
            height: 36px;
            background: linear-gradient(145deg, var(--ember), #8c2410);
            border-radius: 50%;
            animation: pulse 1.5s ease infinite;
          }
        `}</style>
        <div className="app-loading-orb" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <style>{`
        .app-shell {
          min-height: 100svh;
          background: var(--ink);
          display: flex;
          flex-direction: column;
        }
        .app-main {
          flex: 1;
          padding-top: 80px;
        }
      `}</style>

      <Nav />
      <main className="app-main">{children}</main>
    </div>
  );
}