"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResultPage() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [historySaved, setHistorySaved] = useState<boolean>(false);
  const [localHistory, setLocalHistory] = useState<any[]>([]);

  // Ambil hasil terakhir dari localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("cv_analysis");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.analysis && parsed.cv_text) {
          setAnalysis(parsed.analysis);
          setCvText(parsed.cv_text);
        }
      } catch (e) {
        console.error("Gagal parsing data dari localStorage:", e);
      }
    }
  }, []);

  // Simpan hasil terakhir ke backend
  useEffect(() => {
    const storeHistory = async () => {
      if (cvText && analysis && !historySaved) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token JWT tidak ditemukan.");
          return;
        }

        try {
          const response = await fetch("http://localhost:8000/history/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cv_text: cvText, analysis }),
          });

          if (!response.ok) {
            const errMsg = await response.text();
            console.error("Gagal menyimpan history:", errMsg);
          } else {
            console.log("History berhasil disimpan ke backend.");
            setHistorySaved(true);
            localStorage.removeItem("cv_analysis"); // Hindari penyimpanan ulang
          }
        } catch (err) {
          console.error("Gagal menyimpan history:", err);
        }
      }
    };

    storeHistory();
  }, [cvText, analysis, historySaved]);

  // Fallback: Ambil dari backend jika tidak ada di localStorage
  useEffect(() => {
    const fetchHistory = async () => {
      if (!cvText && !analysis) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token JWT tidak ditemukan.");
          return;
        }

        try {
          const response = await fetch("http://localhost:8000/history/me", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error("Gagal mengambil riwayat:", errText);
            return;
          }

          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCvText(data[0].cv_text);
            setAnalysis(data[0].analysis);
          }
        } catch (err) {
          console.error("Gagal mengambil data history:", err);
        }
      }
    };

    fetchHistory();
  }, [cvText, analysis]);

  // Ambil riwayat lokal
  useEffect(() => {
    const history = localStorage.getItem("cv_analysis_history");
    if (history) {
      try {
        const parsed = JSON.parse(history);
        setLocalHistory(parsed);
      } catch (e) {
        console.error("Gagal parsing riwayat lokal:", e);
      }
    }
  }, []);

  const handleClearLocalHistory = () => {
    localStorage.removeItem("cv_analysis_history");
    setLocalHistory([]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-green-100 via-white to-blue-100 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100">
          <Link href="/upload">
            <Button className="mb-6 bg-teal-600 text-white hover:bg-teal-700" variant={undefined} size={undefined}>
              Kembali ke Upload
            </Button>
          </Link>

          <h1 className="text-2xl font-bold text-blue-900 mb-6">Hasil Analisis CV</h1>

          {!analysis ? (
            <p className="text-gray-700">
              Tidak ada hasil analisis yang ditemukan. Silakan unggah CV terlebih dahulu.
            </p>
          ) : (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-8">
              {analysis}
            </div>
          )}

          {localHistory.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Riwayat Analisis Lokal</h2>
              <ul className="space-y-4">
                {localHistory.map((item, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Waktu:</strong>{" "}
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <p className="text-gray-800 whitespace-pre-wrap">{item.analysis}</p>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleClearLocalHistory}
                className="mt-6 bg-red-600 text-white hover:bg-red-700" variant={undefined} size={undefined}              >
                Hapus Riwayat Lokal
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
