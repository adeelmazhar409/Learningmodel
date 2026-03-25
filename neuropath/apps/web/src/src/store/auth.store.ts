import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Session } from "@neuropath/types";

interface AuthState {
  user:      User | null;
  session:   Session | null;
  isLoading: boolean;

  /* Actions */
  setUser:      (user: User | null) => void;
  setSession:   (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout:       () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:      null,
      session:   null,
      isLoading: true,

      setUser:      (user)      => set({ user }),
      setSession:   (session)   => set({ session }),
      setIsLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({ user: null, session: null, isLoading: false }),
    }),
    {
      name:    "neuropath-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      // Only persist the token — re-fetch user on mount
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        // Mark loading done after rehydration
        if (state) state.setIsLoading(false);
      },
    }
  )
);
