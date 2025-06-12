"use client";

import { useRef, useState } from "react";
import { X, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan saat login.";
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Mohon isi email dan password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login gagal");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Berhasil login!");
      onClose();
      router.push("/Halaman-AI");
    } catch (error: unknown) {
      alert(getErrorMessage(error));
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
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white text-gray-900">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Masuk</h2>

          <div className="space-y-4">
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
              onClick={handleLogin}
              className="w-full rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white py-2"
              disabled={loading}
              variant={undefined}
              size={undefined}
            >
              {loading ? "Masuk..." : "Masuk"}
            </Button>

            <p className="text-sm mt-2 text-center text-gray-500">
              Belum punya akun?{" "}
              <span
                onClick={onSwitchToRegister}
                className="text-teal-600 font-medium cursor-pointer hover:underline"
              >
                Daftar sekarang!
              </span>
            </p>
          </div>
        </div>

        {/* Bagian Kanan Modal */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue">
          <Image src={Logo} alt="Logo" className="w-3/4 max-w-xs" />
        </div>
      </div>
    </div>
  );
}
