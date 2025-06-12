import React from "react";
import Logo from "@/assets/Logo.png";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#c5f1dc] to-[#d2e1f9] py-8 px-6 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <img src={Logo.src} alt="FindMyWork.AI" className="w-6 h-6" />
          <span className="font-semibold">FindMyWork.AI</span>
          <span className="ml-4 text-gray-500">© 2025 All Rights Reserved</span>
        </div>
        <div className="text-center md:text-right">
          <p className="font-semibold text-gray-800">FindMyWork.AI</p>
          <p className="text-xs text-gray-500 max-w-xs">
            Expertise dalam pencarian lowongan kerja real-time, menghubungkan talenta dengan peluang terbaik.
          </p>
          <div className="flex justify-center md:justify-end gap-4 mt-3 text-gray-600 text-lg">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>
        </div>
      </div>
    </footer>
  );
}
