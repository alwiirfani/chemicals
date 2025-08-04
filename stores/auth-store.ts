import { create } from "zustand";

type AuthState = {
  email: string;
  password: string;
  error: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  password: "",
  error: "",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  resetAuth: () => set({ email: "", password: "", error: "" }),
}));
