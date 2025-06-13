import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import logging

# Setup logging dengan lebih detail
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

router = APIRouter()

# Configure the Gemini API
api_key = os.getenv("GEMINI_API_KEY_CHT")
if not api_key:
    logger.error("GEMINI_API_KEY_CHT tidak ditemukan dalam environment variables")

genai.configure(api_key=api_key)

class Message(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_bot(msg: Message):
    if not api_key:
        return {"reply": "Maaf, fitur AI konsultan sedang dalam pemeliharaan. Silakan coba lagi nanti."}
        
    try:
        # Gunakan generate_content langsung daripada chat session
        logger.debug(f"Mencoba generate content dengan pesan: {msg.message[:30]}...")
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Tambahkan konteks
        prompt = f"""
        Kamu merupakan konsultan pekerjaan dan hanya menerima pertanyaan terkait pekerjaan.
        Apabila jawabannya menyebutkan beberapa jawaban, dan harus dalam bentuk daftar angka (1, 2, 3) menurun TIDAK kesamping.
        Dilarang membuat format kata, kalimat, maupun textnya dalam bentuk bold, italic.
        
        Pertanyaan pengguna: {msg.message}
        """
        
        # Gunakan generation config yang sederhana
        response = model.generate_content(
            prompt,
            generation_config={"temperature": 0.7, "max_output_tokens": 800}
        )
        
        text = response.text.strip()
        logger.info(f"Berhasil mendapatkan respons: {text[:30]}...")
        return {"reply": text}
            
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error: {error_msg}")
        
        # Provide fallback response
        query = msg.message.lower()
        
        if "pekerjaan" in query or "karir" in query:
            fallback_response = "Untuk mengembangkan karir Anda, pertimbangkan: \n1. Meningkatkan keterampilan yang relevan dengan industri\n2. Membangun jaringan profesional\n3. Mencari mentor di bidang yang diminati"
        elif "cv" in query or "resume" in query:
            fallback_response = "Tips memperbaiki CV:\n1. Sesuaikan dengan posisi yang dilamar\n2. Gunakan kata kunci yang relevan\n3. Tonjolkan pencapaian, bukan hanya tanggung jawab\n4. Pastikan tidak ada kesalahan penulisan"
        else:
            fallback_response = "Sebagai konsultan karir, saya dapat membantu Anda dengan pertanyaan terkait pekerjaan, pengembangan karir, atau perbaikan CV. Apa yang ingin Anda ketahui?"
            
        # Return fallback response langsung daripada throw error
        return {"reply": fallback_response}

# Endpoint diagnostik untuk membantu debugging
@router.get("/chat/diagnostic")
async def diagnostic():
    if not api_key:
        return {"status": "error", "message": "API key tidak ditemukan"}
    
    try:
        # Test koneksi ke API
        models = ["gemini-1.5-flash", "gemini-pro"]
        model_info = []
        for model_name in models:
            try:
                model = genai.GenerativeModel(model_name)
                test_response = model.generate_content("Test")
                model_info.append({
                    "name": model_name,
                    "status": "available",
                    "test_response": test_response.text[:50] + "..."
                })
            except Exception as e:
                model_info.append({
                    "name": model_name,
                    "status": "unavailable",
                    "error": str(e)
                })
                
        return {
            "status": "ok",
            "api_key_masked": f"{api_key[:5]}...{api_key[-4:]}",
            "models": model_info
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}