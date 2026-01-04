import { create } from "zustand";

interface AuthState {
  user: IFetchUserRes | null;
  authenticated: boolean;
  isLoading: boolean;

  setUser: (user: IFetchUserRes) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  clearUser: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  authenticated: false,
  isLoading: true, // Start with loading true to prevent premature redirects

  setUser: (user) => set({ user, authenticated: true }),

  setAuthenticated: (authenticated) => set({ authenticated }),

  setLoading: (isLoading) => set({ isLoading }),

  clearUser: () =>
    set({
      user: null,
      authenticated: false,
    }),
}));
