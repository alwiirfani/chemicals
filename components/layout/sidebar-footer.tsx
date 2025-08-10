"use client";

import { UserAuth } from "@/types/auth";
import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import axios from "axios";

interface SidebarFooterProps {
  user: UserAuth | null;
}

const SidebarFooter = ({ user }: SidebarFooterProps) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "LABORAN":
        return "Laboran";
      case "DOSEN":
        return "Dosen";
      case "MAHASISWA":
        return "Mahasiswa";
      default:
        return role;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout", {
        withCredentials: true,
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {getRoleLabel(user?.role || "")}
          </p>
          {user?.roleId && (
            <p className="text-xs text-gray-400">ID: {user.roleId}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Keluar
      </Button>
    </div>
  );
};

export default SidebarFooter;
