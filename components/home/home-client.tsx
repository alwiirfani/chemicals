import { UserAuth } from "@/types/auth";
import React from "react";
import HomeCarousel from "./home-carousel";
import { Sidebar } from "../layout/sidebar";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface HomeClientProps {
  user?: UserAuth | null;
}

const HomeClient: React.FC<HomeClientProps> = ({ user }) => {
  return (
    <>
      {user && <Sidebar />}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between mb-4">
          {/* header page */}
          <div>
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

          {/* login button */}
          {!user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className=" w-36 bg-blue-500 text-white flex items-center justify-center gap-2 py-2 rounded-md hover:bg-blue-600 transition-colors">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </div>
          ) : null}
        </div>

        {/* carousel section */}
        <HomeCarousel />
      </div>
    </>
  );
};

export default HomeClient;
