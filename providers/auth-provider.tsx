"use client";

import { UserAuth } from "@/types/auth";
import axios from "axios";
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

type AuthContextType = {
  user: UserAuth | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

// Fetcher pakai React Query
const fetchUserMe = async (): Promise<UserAuth | null> => {
  try {
    const res = await axios.get("/api/v1/auth/me");
    return res.data.user ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user = null, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchUserMe,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useUser = () => useContext(AuthContext);
