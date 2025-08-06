"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen">
          <Sidebar />
          <main>{children}</main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ProtectedLayout;
