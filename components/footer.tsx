import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="text-center text-sm text-gray-500 space-y-2 mt-10">
      <p>© 2025 Sistem Manajemen Inventaris Kimia. Semua hak dilindungi.</p>
      <div className="space-x-3">
        <Link href="/about" className="underline hover:text-gray-700">
          Tentang
        </Link>
        <Link href="/contact" className="underline hover:text-gray-700">
          Kontak
        </Link>
        <Link href="/privacy" className="underline hover:text-gray-700">
          Kebijakan Privasi
        </Link>
      </div>
      <p className="text-xs text-gray-400">Versi 1.0.0</p>
    </footer>
  );
};

export default Footer;
