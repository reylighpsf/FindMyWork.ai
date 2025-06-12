import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative bg-white overflow-hidden py-24 px-6 md:px-16">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-full bg-gradient-to-br from-white via-[#c5f1dc] to-[#d2e1f9] opacity-60 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-4xl text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
          Pencarian Lowongan Pekerjaan berbasis AI untuk Para Pekerja Profesional Modern
        </h1>
        <p className="text-blue-900 mt-6 text-lg md:text-xl max-w-2xl">
          Unggah CV-mu, Biarkan AI Mencocokkanmu <br />
          dengan Lowongan Pekerjaan Sesuai Potensimu!
        </p>

        <Link href="/Halaman-AI">
          <Button className="mt-8 px-10 py-3 text-white text-lg font-semibold rounded-full shadow-lg bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600">
            Unggah CV & Dapatkan Rekomendasi
          </Button>
        </Link>
      </div>
    </div>
  );
}
