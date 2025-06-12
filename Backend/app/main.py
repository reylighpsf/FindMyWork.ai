from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.db import Base
from app.routers import auth, history
from app.services.cv_analyzer import CVAnalyzer
from app.services.chatbot import router as chatbot_router
from fastapi import APIRouter, UploadFile, File, HTTPException

load_dotenv()

app = FastAPI(
    title="FindWork.AI Backend",
    description="API untuk autentikasi dan analisis CV",
    version="1.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # sesuaikan dengan frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi CVAnalyzer sekali saja
analyzer = CVAnalyzer(api_key=os.getenv("GEMINI_API_KEY"))

# Router khusus untuk CV upload dan analisis
cv_router = APIRouter(prefix="/cv", tags=["CV"])

@cv_router.post("/upload_cv/")
async def upload_cv(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Hanya file PDF yang diizinkan.")
    try:
        file_bytes = await file.read()
        print(f"Received file of size: {len(file_bytes)} bytes")

        text = analyzer.extract_text_from_pdf_bytes(file_bytes)
        if not text.strip():
            raise ValueError("Teks dalam PDF kosong.")

        analysis = analyzer.analyze_cv_text(text)

        return {
            "cv_text": text,
            "analysis": analysis
        }
    except Exception as e:
        print(f"Error processing upload_cv: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Register routers utama
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(history.router)  # asumsi sudah ada prefix di dalam router history
app.include_router(chatbot_router, prefix="/api")
app.include_router(cv_router)

