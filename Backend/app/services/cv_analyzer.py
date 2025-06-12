from io import BytesIO
import fitz  # PyMuPDF
from google import genai
from google.genai import types

class CVAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-2.0-flash"

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
                "Lakukan analisis terhadap CV yang dilampirkan dan berikan hasilnya dalam format berikut:\n\n"
                "1. Ringkasan Profil.\n"
                "Highlight singkat tentang keahlian utama, pengalaman kerja, dan latar belakang pendidikan.\n"
                "2. Kecocokan Posisi Kerja.\n"
                "Rekomendasi lowongan pekerjaan yang cocok berdasarkan pengalaman dan skill pemilik CV, disertai alasan mengapa posisi tersebut cocok (misalnya sesuai dengan skill utama, level pengalaman, atau minat).\n"
                "3. Rekomendasi Pekerjaan:\n"
                "a. Carikan 5 posisi pekerjaan yang paling cocok untuk kandidat berdasarkan informasi dari CV.\n"
                "b. Gunakan sumber terpercaya seperti LinkedIn Jobs, Jobstreet, Kalibrr, Glints, maupun situs resmi perusahaan yang.\n"
                "c. Sertakan informasi berikut untuk setiap rekomendasi:\n"
                "    1) Judul Pekerjaan\n"
                "    2) Perusahaan\n"
                "    3) Lokasi\n"
                "    4) Alasan Kecocokan (1–2 kalimat)\n\n"
                "    5) berikan Tautan Lowongan dari pekerjaan tersebut(berikan URL langsung yang dapat diklik)\n\n"
                "Note: Jangan ada kata,kalimat, maupun text yang di bold/italic. Rapikan tampilannya agar mudah dibaca.rapikan urutan rekomendasi pekerjaan"
        )

        contents = [
               types.Content(
                     role="user",
                     parts=[types.Part.from_text(text=prompt + cv_text)],
            ),
        ]

        generate_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
            temperature=0.7,
            max_output_tokens=1024,
        )

        analysis_result = []
        try:
            for response in self.client.models.generate_content_stream(
                model=self.model,
                contents=contents,
                config=generate_config,
            ):
                if response.text:
                    analysis_result.append(response.text)
            return "".join(analysis_result).strip()
        except Exception as e:
            raise RuntimeError(f"Error dari Gemini API: {str(e)}")
