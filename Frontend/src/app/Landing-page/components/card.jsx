import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaBrain, FaChartLine } from "react-icons/fa";

export default function WhySection() {
  return (
    <div className="bg-[#002e5b] text-white py-20 px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-12">Mengapa harus FindMyWork.AI?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="bg-white text-[#002e5b] rounded-2xl border-2 border-blue-300">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <FaBrain className="text-5xl text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg">AI-Powered Matching</h3>
            <p className="text-sm mt-2 text-gray-600 max-w-xs">
              dengan algoritma pintar menghubungkan Anda dengan peluang kerja terbaik
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white text-[#002e5b] rounded-2xl border-2 border-blue-300">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <FaChartLine className="text-5xl text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg">Smart Career Insight</h3>
            <p className="text-sm mt-2 text-gray-600 max-w-xs">
              selangkah lebih maju dengan analisis pasar kerja real-time
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
