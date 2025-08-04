"use client";

import Link from "next/link";
import { ArrowLeft, Search, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number with gradient */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-gray-200 to-white bg-clip-text text-transparent leading-none">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-gray-200 -z-10 blur-sm">
            404
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau
            tidak pernah ada.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-gray-200 to-white px-8 py-3 rounded-full font-semibold hover:from-blue-500 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <LayoutDashboard className="w-5 h-5" />
            Kembali ke Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
            <ArrowLeft className="w-5 h-5" />
            Halaman Sebelumnya
          </button>
        </div>

        {/* Search suggestion */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-6 h-6 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Coba cari yang lain?
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Mungkin Anda bisa menemukan apa yang dicari di halaman-halaman
            berikut:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/about"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200">
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200">
              Kontak
            </Link>
            <Link
              href="/privacy"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200">
              Kebijakan Privasi
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
