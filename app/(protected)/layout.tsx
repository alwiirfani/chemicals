import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth";
import React from "react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  return (
    <div className="min-h-screen">
      {user && (
        <>
          <Sidebar user={user} />
          {children}
        </>
      )}
    </div>
  );
};

export default ProtectedLayout;
