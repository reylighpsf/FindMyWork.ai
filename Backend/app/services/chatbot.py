import os
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

router = APIRouter()

# Buat client sekali (mengambil dari env GOOGLE_API_KEY)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY_CHT"))

class Message(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_bot(msg: Message):
    # buat query ke Gemini
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            "halo",
            "Halo! Ada yang bisa saya bantu terkait pekerjaan atau karir Anda?",
            msg.message,
        ],
        config=types.GenerateContentConfig(
            temperature=0.7,
            system_instruction=[
                "Kamu merupakan konsultan pekerjaan dan hanya menerima pertanyaan terkait pekerjaan."
                "Apabila jawabannya menyebutkan beberapa jawaban, dan harus dalam bentuk daftar angka (1, 2, 3) menurun TIDAK kesamping."
                "Dilarang membuat format kata, kalimat, maupun textnya dalam bentuk bold, italic"
            ],
        ),
    )
    text = response.text.strip()
    return {"reply": text}
