"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  name?: string;
  email: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      fetch("/auth/me", {  
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch((error) => {
          console.error("Authentication error:", error);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
        <div className="text-center max-w-2xl">
          <AnimatePresence>
            {loading ? (
              <motion.h1
                className="text-3xl text-blue-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                Memuat data pengguna...
              </motion.h1>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="sm:text-5xl font-bold text-blue-900">
                  {user
                    ? `Selamat datang, ${user.name || user.email}!`
                    : "Pencarian Lowongan Pekerjaan berbasis AI untuk Para Pekerja Profesional Modern"}
                </h1>
                <p className="mt-4 text-lg text-gray-700">
                  {user
                    ? "Silakan eksplorasi fitur kami atau unggah CV-mu untuk mulai pencarian kerja."
                    : "Unggah CV-mu, Biarkan AI Mencocokkanmu dengan Lowongan Pekerjaan Sesuai Potensimu!"}
                </p>

                <Link href="/upload">
                  <Button
                    variant="default"
                    size="lg"
                    className="mt-5 bg-gradient-to-r from-blue-700 to-green-500 text-white text-2xl px-10 py-7 rounded-full shadow"
                  >
                    {user ? "Mulai Unggah CV" : "Unggah CV"}
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
