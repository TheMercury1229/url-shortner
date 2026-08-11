import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser, registerUser } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  username: string;
  token: string;
};

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
};

type AuthActions = {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Called once on app boot to mark hydration complete */
  setReady: () => void;
};

// ─── Cookie helpers (for proxy.ts to read) ────────────────────────────────────

const TOKEN_COOKIE = "auth_token";

function writeTokenCookie(token: string) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

// ─── Mock helpers ─────────────────────────────────────────────────────────────

/** Fake JWT — just a base-64 encoded JSON blob for display purposes */
function makeMockToken(username: string) {
  const payload = btoa(JSON.stringify({ sub: username, iat: Date.now() }));
  return `mock.${payload}.sig`;
}

/** Simulated 600 ms network delay */
function fakeDelay() {
  return new Promise<void>((resolve) => setTimeout(resolve, 600));
}

// A small in-memory "user DB" so register remembers who signed up in the session
const MOCK_USERS: Record<string, { password: string; username: string }> = {
  demo: { password: "password", username: "demo" },
};


export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      setReady: () => set({ isLoading: false }),

      login: async (username, password) => {
        const res = await loginUser({ username, password });
        const token = res.token;
        writeTokenCookie(token);
        set({ user: { username, token } });
      },
      register: async (username, email, password) => {
        await registerUser({ username, email, password });
        const res = await loginUser({ username, password });
        const token = res.token;
        writeTokenCookie(token);
        set({ user: { username, token } });
      },

      logout: () => {
        clearTokenCookie();
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.user?.token) {
          writeTokenCookie(state.user.token);
        }
        state?.setReady();
      },
    }
  )
);
