"use client";

import { UserAuth } from "@/types/auth";
import React from "react";
import HomeCarousel from "./home-carousel";
import { Sidebar } from "../layout/sidebar";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HomeClientProps {
  user?: UserAuth | null;
}

const HomeClient: React.FC<HomeClientProps> = ({ user }) => {
  const router = useRouter();
  return (
    <>
      {user && <Sidebar />}
      <div className="my-4 px-4">
        <div className="w-full flex justify-end">
          {/* login button */}
          {!user ? (
            <div className="flex items-center justify-end gap-4 py-2">
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/login");
                }}
                className=" w-12 sm:w-36 flex items-center justify-center gap-2 py-5 rounded-md hover:bg-gray-100 transition-colors">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline-block">Login</span>
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between mb-4">
          {/* header page */}
          <div
            className={cn(
              "flex w-full flex-col justify-center items-center",
              user ? "sm:justify-start sm:items-start" : "sm:justify-center"
            )}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Beranda
            </h1>
            {user ? (
              <p className="text-gray-600 text-sm sm:text-base">
                Selamat datang, <span className="font-medium">{user.name}</span>
                ! Berikut adalah halaman utama aplikasi.
              </p>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                Silakan Login! untuk mengakses fitur aplikasi.
              </p>
            )}
          </div>
        </div>

        {/* carousel section */}
        <HomeCarousel />
      </div>
    </>
  );
};

export default HomeClient;
