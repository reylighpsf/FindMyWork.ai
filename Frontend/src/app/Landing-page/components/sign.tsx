"use client";

import { useRef, useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/assets/Logo.png";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

type InputProps = {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

const InputField = ({ icon, type, placeholder, value, onChange }: InputProps) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border-b-2 border-gray-300 pl-10 py-2 focus:outline-none focus:border-teal-600"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="absolute left-2 top-2.5 text-gray-400">{icon}</div>
  </div>
);

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleRegister = async () => {
    if (!username || !name || !email || !password) {
      alert("Mohon lengkapi semua kolom.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Format email tidak valid");
      return;
    }

    if (password.length < 8) {
      alert("Password harus minimal 8 karakter");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Gagal mendaftar.");
      }

      alert("Berhasil mendaftar! Silakan login.");
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-teal-700 to-blue-900 rounded-3xl shadow-xl flex w-full max-w-4xl overflow-hidden relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          aria-label="Tutup modal"
          type="button"
        >
          <X size={24} />
        </button>

        {/* Form Registrasi */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white text-gray-900">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Daftar</h2>

          <div className="space-y-4">
            <InputField
              icon={<User size={18} />}
              type="text"
              placeholder="Username"
              value={username}
              onChange={setUsername}
            />
            <InputField
              icon={<User size={18} />}
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={setName}
            />
            <InputField
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />
            <InputField
              icon={<Lock size={18} />}
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={setPassword}
            />

            <Button
              onClick={handleRegister}
              className="w-full rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white py-2"
              disabled={loading}
              type="button" variant={undefined} size={undefined}            >
              {loading ? "Mendaftar..." : "Daftar"}
            </Button>

            <p className="text-sm mt-2 text-center text-gray-500">
              Sudah punya akun?{" "}
              <span
                onClick={onSwitchToLogin}
                className="text-teal-600 font-medium cursor-pointer hover:underline"
              >
                Masuk sekarang!
              </span>
            </p>
          </div>
        </div>

        {/* Bagian Kanan Modal */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue">
          <Image src={Logo} alt="Logo" className="w-3/4 max-w-xs" priority />
        </div>
      </div>
    </div>
  );
}
