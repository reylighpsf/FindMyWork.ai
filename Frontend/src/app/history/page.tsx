"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { saveHistory } from "./services/history";
import { motion, AnimatePresence } from "framer-motion";

type HistoryItem = {
  name: string;
  cvText: string;
  analysis: string;
  timestamp: string;
  backendId?: string;
};

export default function ResultPage() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [historySaved, setHistorySaved] = useState<boolean>(false);
  const [localHistory, setLocalHistory] = useState<HistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("cv_analysis");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setAnalysis(parsed.analysis || null);
      setCvText(parsed.cv_text || null);
    }

    const historyData = localStorage.getItem("cv_analysis_history");
    if (historyData) {
      const parsed: HistoryItem[] = JSON.parse(historyData);
      setLocalHistory(parsed);
    }
  }, []);

  useEffect(() => {
    const storeHistory = async () => {
      if (cvText && analysis && !historySaved) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.warn("Token JWT tidak ditemukan di localStorage.");
            return;
          }

          await saveHistory(cvText, analysis, token);
          setHistorySaved(true);
          console.log("History berhasil disimpan.");

          const localHistory = localStorage.getItem("cv_analysis_history");
          if (localHistory) {
            const parsed = JSON.parse(localHistory);
            setLocalHistory(parsed);
          }
        } catch (err) {
          console.error("Gagal menyimpan history", err);
        }
      }
    };

    storeHistory();
  }, [cvText, analysis, historySaved]);

  const handleClearHistory = () => {
    localStorage.removeItem("cv_analysis_history");
    localStorage.removeItem("cv_analysis");
    setLocalHistory([]);
    setAnalysis(null);
    setCvText(null);
    setSelectedIndex(null);
    alert("Riwayat dan hasil analisis berhasil dihapus.");
  };

  const handleSelectHistory = (index: number) => {
    const item = localHistory[index];
    setAnalysis(item.analysis);
    setCvText(item.cvText);
    setSelectedIndex(index);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-green-100 via-white to-blue-100 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100"
        >
          <div className="flex justify-between items-center mb-6 gap-2">
            <Link href="/upload">
              <Button className="bg-teal-600 text-white hover:bg-teal-700" variant={undefined} size={undefined}>
                Kembali ke Upload
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button
                onClick={handleClearHistory}
                className="bg-red-500 hover:bg-red-600 text-white" variant={undefined} size={undefined}              >
                Hapus Riwayat
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white" variant={undefined} size={undefined}              >
                Refresh
              </Button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-blue-900 mb-4">Hasil Analisis CV</h1>

          <p className="text-sm text-gray-600 mb-4">
            history : <strong>{localHistory.length}</strong>
          </p>

          {localHistory.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-1 border-r pr-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Riwayat:</h2>
                <ul className="space-y-2">
                  <AnimatePresence>
                    {localHistory.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <button
                          onClick={() => handleSelectHistory(index)}
                          className={`text-left w-full p-2 rounded-lg border ${
                            selectedIndex === index
                              ? "bg-blue-100 border-blue-400"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div className="md:col-span-3">
                <AnimatePresence>
                  {analysis ? (
                    <motion.div
                      key="analysis-box"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gray-50 p-4 rounded-xl border max-h-[500px] overflow-auto"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-blue-800">
                        Detail Analisis
                      </h3>
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed overflow-auto">
                        {analysis}
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="no-analysis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-700"
                    >
                      Tidak ada hasil analisis yang ditemukan. Silakan unggah CV terlebih dahulu.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {localHistory.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 italic"
            >
              Belum ada riwayat analisis yang tersimpan.
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
