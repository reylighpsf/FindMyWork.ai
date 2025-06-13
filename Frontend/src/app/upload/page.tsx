"use client";

import React, { useState, useRef } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadError(null);
    } else {
      setUploadError("Hanya file PDF yang diperbolehkan.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Silakan pilih file terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/cv/upload_cv/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || "Gagal mengunggah atau menganalisis CV."
        );
      }

      const { cv_text, analysis } = await response.json();

      localStorage.setItem(
        "cv_analysis",
        JSON.stringify({ analysis, cv_text })
      );

      const newItem = {
        name: "Analisis CV",
        cvText: cv_text,
        analysis: analysis,
        timestamp: new Date().toISOString(),
      };

      const existing = localStorage.getItem("cv_analysis_history");
      const history = existing ? JSON.parse(existing) : [];
      history.unshift(newItem);
      localStorage.setItem("cv_analysis_history", JSON.stringify(history));

      router.push("/result");
    } catch (error) {
      console.error("Upload/Analyze error:", error);
      setUploadError("Terjadi kesalahan saat mengunggah atau menganalisis CV.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-green-100 via-white to-blue-100 p-8">
        <div className="max-w-xl mx-auto mt-10">
          <Link href="/Halaman-AI">
            <Button
              className="mb-6 flex items-center gap-1 bg-teal-600 text-white hover:bg-teal-700"
              variant={undefined}
              size={undefined}
            >
              <ArrowLeft size={16} /> Kembali
            </Button>
          </Link>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Unggah CV Anda
            </h2>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-600 mb-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={36} />
              {selectedFile ? (
                <p className="font-medium text-black">{selectedFile.name}</p>
              ) : (
                <>
                  <p>Tarik dan lepaskan file anda</p>
                  <span>atau</span>
                  <div className="bg-gray-200 text-black px-4 py-1 rounded-md">
                    Pilih file
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {uploadError && <p className="text-red-500 mb-4">{uploadError}</p>}

            <Button
              onClick={handleUpload}
              className="bg-gradient-to-r from-blue-700 to-green-500 text-white text-md px-6 py-2 rounded-full shadow"
              disabled={isUploading}
              variant={undefined}
              size={undefined}
            >
              {isUploading ? "Mengunggah..." : "Unggah"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
