// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi pengiriman
    toast({
      title: "Pesan Terkirim",
      description: "Terima kasih, kami akan segera menghubungi Anda.",
    });

    // Reset form
    setNama("");
    setEmail("");
    setPesan("");
  };

  return (
    <div className="min-h-screen px-4 py-12 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Hubungi Kami
      </h1>
      <p className="text-gray-700 text-center">
        Jika Anda memiliki pertanyaan, kritik, atau saran, silakan isi formulir
        di bawah ini.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label
            htmlFor="nama"
            className="block mb-1 font-medium text-gray-700">
            Nama
          </Label>
          <Input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Nama Anda"
          />
        </div>

        <div>
          <Label
            htmlFor="email"
            className="block mb-1 font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />
        </div>

        <div>
          <Label
            htmlFor="pesan"
            className="block mb-1 font-medium text-gray-700">
            Pesan
          </Label>
          <Textarea
            id="pesan"
            rows={5}
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            required
            placeholder="Tulis pesan Anda di sini..."
          />
        </div>

        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Kirim Pesan
        </Button>
      </form>

      <div className="pt-8 text-center text-sm text-gray-500">
        <p>
          Atau hubungi langsung:{" "}
          <code>
            <Link
              href="mailto:example@gmail.com"
              className="text-blue-600 underline">
              example@gmail.com
            </Link>
          </code>
        </p>

        <Footer />
      </div>
    </div>
  );
}
