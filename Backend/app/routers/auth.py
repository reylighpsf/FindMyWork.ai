from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import db, auth as auth_utils
from app.services.auth_service import create_access_token
from app.crud import crud
from app.schemas import schemas
from app.security import get_password_hash

router = APIRouter()

@router.post("/signup", response_model=schemas.UserOut)
def sign_up(user: schemas.UserCreate, session: Session = Depends(db.get_db)):
    existing_user = crud.get_user_by_email(session, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = crud.create_user(session, user)
    return db_user

@router.post("/login", response_model=schemas.LoginResponse)
def login(user: schemas.UserLogin, session: Session = Depends(db.get_db)):
    db_user = crud.get_user_by_email(session, email=user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="Email not found")
    if not crud.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "username": db_user.username,
        }
    }

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: schemas.UserOut = Depends(auth_utils.get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    request: schemas.ChangePasswordRequest,
    session: Session = Depends(db.get_db),
    current_user: schemas.UserOut = Depends(auth_utils.get_current_user),
):
    db_user = crud.get_user_by_email(session, email=current_user.email)
    
    if not crud.verify_password(request.old_password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Password lama salah")

    db_user.password_hash = get_password_hash(request.new_password)
    session.commit()

    return {"message": "Password berhasil diubah"}
