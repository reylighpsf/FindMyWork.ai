from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.models import CVAnalysisHistory, User
from app.schemas.schemas import HistoryCreate, HistoryResponse
from app.auth import get_current_user  # Fungsi untuk dapatkan user dari JWT token

router = APIRouter(prefix="/history", tags=["history"])

@router.post("/save", response_model=HistoryResponse)
def save_history(
    history_in: HistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_history = CVAnalysisHistory(
        cv_text=history_in.cv_text,
        analysis=history_in.analysis,
        user_id=current_user.id
    )
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@router.get("/me", response_model=List[HistoryResponse])
def get_my_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    histories = db.query(CVAnalysisHistory).filter(CVAnalysisHistory.user_id == current_user.id).order_by(CVAnalysisHistory.created_at.desc()).all()
    return histories
