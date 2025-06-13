"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Home, User, FileText, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import Logo from "@/assets/Logo.png";
import ChatbotWidget from "../components/ChatbotWidget";
import { motion } from "framer-motion";

const navItems = [
  { label: "Halaman Utama", href: "/Halaman-AI", icon: <Home size={16} /> },
  { label: "Profil", href: "/profile", icon: <User size={16} />, protected: true },
  { label: "Riwayat", href: "/history", icon: <FileText size={16} />, protected: true },
  { label: "Keluar", href: "/Landing-page", icon: <LogOut size={16} />, logout: true },
];

function BrandLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 px-4 py-3 bg-white rounded-tl-[2rem] rounded-br-[2rem] shadow border border-teal-500"
    >
      <Image src={Logo} alt="FindMyWork Logo" width={36} height={36} />
      <span className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
        FindMyWork
      </span>
    </motion.div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/auth/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
        setToken(storedToken);
      } catch {
        localStorage.removeItem("access_token");
        setUser(null);
        setToken(null);
      }
    };

    fetchUser();
  }, []);

  const handleNavClick = (
    href: string,
    isProtected?: boolean,
    isLogout?: boolean
  ) => async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isLogout) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("cv_analysis");
      localStorage.removeItem("cv_analysis_history");
      setUser(null);
      setToken(null);
      router.replace("/");
      return;
    }

    if (isProtected && !token) {
      alert("Silakan login untuk mengakses fitur ini.");
      return;
    }

    router.push(href);
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-60 bg-gradient-to-b from-blue-900 to-green-500 text-white shadow-lg min-h-screen flex flex-col justify-between"
    >
      <div>
        <div className="p-4 border-b border-white/20">
          <BrandLogo />
        </div>

        <nav className="mt-4">
          <ul className="space-y-2 px-4">
            {navItems.map(({ label, href, icon, protected: isProtected, logout: isLogout }, index) => {
              const isActive = pathname?.startsWith(href);
              return (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <a
                    href={href}
                    onClick={handleNavClick(href, isProtected, isLogout)}
                    className={`flex items-center gap-2 p-2 rounded-lg font-semibold transition-colors cursor-pointer transform hover:scale-105 ${
                      isActive ? "bg-white text-black" : "text-white hover:bg-white/20"
                    }`}
                  >
                    {icon} {label}
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <motion.div
          className="mt-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ChatbotWidget />
        </motion.div>
      </div>

      <motion.div
        className="px-4 py-3 border-t border-white/20 bg-black/10 text-sm text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {user ? (
          <div>
            <p className="font-medium">{user.name || user.email}</p>
            <p className="text-white/70 text-xs truncate">{user.email}</p>
          </div>
        ) : (
          <p className="italic text-white/60">Belum login</p>
        )}
      </motion.div>
    </motion.aside>
  );
}
