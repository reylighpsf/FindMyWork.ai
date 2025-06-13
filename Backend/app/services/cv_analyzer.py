from io import BytesIO
import fitz  # PyMuPDF
import google.generativeai as genai

class CVAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model_name = "gemini-2.0-flash" 

    def extract_text_from_pdf_bytes(self, file_bytes: bytes) -> str:
        try:
            pdf_stream = BytesIO(file_bytes)
            text = ""
            with fitz.open(stream=pdf_stream, filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text()
            return text.strip()
        except Exception as e:
            raise RuntimeError(f"Gagal membaca PDF: {str(e)}")

    def analyze_cv_text(self, cv_text: str) -> str:
        prompt = (
            "Kamu adalah asisten AI rekrutmen cerdas. Tugasmu adalah membaca dan menganalisis isi dari CV yang diberikan. "
            "Gunakan pemahaman mendalam terhadap industri kerja, peran pekerjaan, dan tren perekrutan untuk memberikan hasil analisis terbaik. Maksimal 5 pekerjaan "
            "Output harus disusun secara profesional, informatif, dan mudah dibaca. Jangan gunakan penebalan (bold) atau pemiringan (italic), tanpa === maupun ###, Anda bisa menggunakan scrapping untuk mendapatkan link yang dapat diakses. Jangan gunakan link yang dummy. .\n\n"

            "Gunakan struktur berikut:\n\n"

            "Ringkasan Profil:\n"
            "- Berikan ringkasan singkat tentang kandidat: bidang keahlian utama, pengalaman kerja yang relevan, pencapaian signifikan (jika ada), dan latar belakang pendidikan.\n"
            "- Buat ringkasan ringkas namun menyeluruh, maksimal 4–5 kalimat.\n\n"

            "Analisis Kecocokan Posisi:\n"
            "- Berdasarkan isi CV, tentukan jenis atau kategori pekerjaan yang paling cocok untuk kandidat ini.\n"
            "- Jelaskan alasan dari rekomendasi tersebut secara logis, misalnya: kesesuaian skill teknis, pengalaman sebelumnya, minat kandidat, atau kombinasi keahlian langka.\n\n"

            "Rekomendasi Pekerjaan:\n"
            "- Temukan dan tampilkan 5 lowongan pekerjaan yang sangat relevan dengan kandidat.\n"
            "- Prioritaskan hasil dari sumber tepercaya seperti LinkedIn Jobs, Jobstreet, Glints, Kalibrr, dan situs resmi perusahaan (jika memungkinkan).\n"
            "- Untuk setiap lowongan, berikan informasi lengkap dengan format berikut:\n"
            "  1. Judul Pekerjaan\n"
            "    b. Nama Perusahaan\n"
            "    c. Lokasi\n"
            "    d. Alasan Kecocokan (1–2 kalimat yang menjelaskan relevansi lowongan dengan profil kandidat)\n"
            "    e. Tautan Langsung ke Lowongan (URL aktif dan dapat diklik, jangan dummy link!)\n"
            "- Pastikan hasilnya disusun bernomor (1 hingga 5) dan konsisten secara format.\n\n"

            "Catatan Tambahan:\n"
            "- Gunakan bahasa profesional dan lugas.\n"
            "- Jangan berikan opini personal.\n"
            "- Jangan masukkan bagian atau informasi tambahan di luar struktur di atas.\n\n"

            "Berikut adalah CV yang harus dianalisis:\n\n"
            f"{cv_text}"
        )

        model = genai.GenerativeModel(self.model_name)
        
        analysis_result = []
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 1024,
                },
                stream=True
            )
            
            for chunk in response:
                if chunk.text:
                    analysis_result.append(chunk.text)
            
            return "".join(analysis_result).strip()
        except Exception as e:
            raise RuntimeError(f"Error dari Gemini API: {str(e)}")