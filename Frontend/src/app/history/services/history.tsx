// services/history.ts

export async function saveHistory(cvText: string, analysis: string, token: string) {
  const response = await fetch("/history/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cv_text: cvText, analysis }),
  });

  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || "Gagal menyimpan riwayat";
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(`Gagal menyimpan riwayat: ${errorMessage}`);
  }

  const savedData = await response.json();

  const existing = localStorage.getItem("cv_analysis_history");
  const historyList = existing ? JSON.parse(existing) : [];

  const newEntry = {
    name: `Analisis CV ${historyList.length + 1}`,
    cvText,
    analysis,
    timestamp: new Date().toISOString(),
    backendId: savedData.id || null,
  };

  historyList.unshift(newEntry); 
  localStorage.setItem("cv_analysis_history", JSON.stringify(historyList));

  return savedData;
}