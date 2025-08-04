"use client";

import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

interface SidebarNavProps {
  navigation: NavigationItem[];
  pathname: string;
  setIsOpen: (value: boolean) => void;
  userRole?: string;
}

const SidebarNav = ({
  navigation,
  pathname,
  setIsOpen,
  userRole,
}: SidebarNavProps) => {
  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || userRole === "ADMIN"
  );

  return (
    <>
      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => setIsOpen(false)}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </>
  );
};

export default SidebarNav;
