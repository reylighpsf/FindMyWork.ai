import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/Logo.png";
import Image from "next/image";

type NavbarProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
};

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 md:px-16 py-4 shadow-md">
      <div className="flex items-center gap-2 text-teal-700 text-2xl font-bold">
        <Image src={Logo} alt="Logo" width={32} height={32} className="w-8 h-8" />
        FindMyWork
      </div>
      <div className="space-x-4">
        <Button
          variant="ghost"
          className="text-teal-800 font-semibold"
          onClick={onLoginClick} size={undefined}
        >
          Masuk
        </Button>
        <Button
          className="rounded-full bg-white border text-teal-900 px-6 hover:bg-teal-50"
          onClick={onRegisterClick} variant={undefined} size={undefined}
        >
          Daftar
        </Button>
      </div>
    </div>
  );
}
