// services/history.ts

export async function saveHistory(cvText: string, analysis: string, token: string) {
  const response = await fetch("http://localhost:8000/history/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cv_text: cvText, analysis }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save history: ${errorText}`);
  }

  const savedData = await response.json();

  // Simpan ke localStorage
  const existing = localStorage.getItem("cv_analysis_history");
  const historyList = existing ? JSON.parse(existing) : [];

  const newEntry = {
    name: `History ${historyList.length + 1}`,
    cvText,
    analysis,
    timestamp: new Date().toISOString(),
    backendId: savedData.id || null,
  };

  historyList.push(newEntry);
  localStorage.setItem("cv_analysis_history", JSON.stringify(historyList));

  return savedData;
}
