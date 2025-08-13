"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  FlaskConical,
} from "lucide-react";
import SidebarNav from "./sidebar-nav";
import SidebarFooter from "./sidebar-footer";
import { useUser } from "@/providers/auth-provider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventaris Bahan", href: "/chemicals", icon: Package },
  { name: "Peminjaman/Bon", href: "/borrowings", icon: FileText },
  { name: "SDS", href: "/sds", icon: FileText },
  { name: "Laporan", href: "/reports", icon: BarChart3 },
  { name: "Pengguna", href: "/users", icon: Users, adminOnly: true },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const { user } = useUser();

  // untuk handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 right-4 z-50 md:hidden transition-opacity duration-300",
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 gap-1">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-11 h-11 bg-blue-300 opacity-50 rounded-full border border-background z-0" />
              <FlaskConical className="relative h-6 w-6 text-blue-600 z-10" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ChemLab</h1>
          </div>

          {/* Navigation */}
          <SidebarNav
            navigation={navigation}
            pathname={pathname}
            setIsOpen={setIsOpen}
            userRole={user?.role}
          />

          {/* User info and logout */}
          <SidebarFooter user={user} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
