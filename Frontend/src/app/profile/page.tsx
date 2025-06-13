"use client";

import React, { useEffect, useState } from "react";
import { User, Shield } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "./components/Card";

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("edit");
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [error, setError] = useState("");

  const [oldPassword1, setOldPassword1] = useState("");
  const [oldPassword2, setOldPassword2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setError("Token tidak valid atau sudah kadaluarsa.");
      }
    } catch (err) {
      console.error("Gagal memuat data pengguna:", err);
      setError("Terjadi kesalahan saat memuat data pengguna.");
    }
  };

  fetchUser();
}, []);

  const handleChangePassword = async () => {
    setSecurityMessage("");

    if (oldPassword1 !== oldPassword2) {
      setSecurityMessage("Password lama tidak cocok.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setSecurityMessage("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      const res = await fetch("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword1,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Gagal mengubah password.");
      }

      setSecurityMessage("Password berhasil diubah.");
      setOldPassword1("");
      setOldPassword2("");
      setNewPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSecurityMessage(err.message || "Terjadi kesalahan.");
}

    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-500 to-teal-400">
        <Card className="w-[600px] rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Profil</h2>

            <div className="flex space-x-4 mb-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "edit"
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("edit")}
              >
                <User className="w-5 h-5" /> Edit Profil
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === "security"
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Shield className="w-5 h-5" /> Keamanan
              </button>
            </div>

            {error ? (
              <div className="text-red-600 font-medium">{error}</div>
            ) : activeTab === "edit" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama</label>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-800">@{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password Lama</label>
                  <input
                    type="password"
                    value={oldPassword1}
                    onChange={(e) => setOldPassword1(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ulangi Password Lama</label>
                  <input
                    type="password"
                    value={oldPassword2}
                    onChange={(e) => setOldPassword2(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                >
                  Ganti Password
                </button>
                {securityMessage && (
                  <p
                    className={`text-sm mt-2 font-medium ${
                      securityMessage.includes("berhasil") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {securityMessage}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
