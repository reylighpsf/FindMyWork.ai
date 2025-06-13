from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import db, auth as auth_utils
from app.services.auth_service import create_access_token
from app.crud import crud
from app.schemas import schemas
from app.security import get_password_hash
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/signup/", response_model=schemas.UserOut)
def sign_up(user: schemas.UserCreate, session: Session = Depends(db.get_db)):
    try:
        # Check duplicate email
        existing_email = crud.get_user_by_email(session, email=user.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
            
        # Check duplicate username - tambahkan pengecekan ini
        existing_username = crud.get_user_by_username(session, username=user.username)
        if existing_username:
            raise HTTPException(status_code=400, detail="Username sudah digunakan")
        
        db_user = crud.create_user(session, user)
        return db_user
    except ValueError as e:
        # Handle errors raised from CRUD operations
        logger.warning(f"Validation error during signup: {str(e)}")
        raise HTTPException(status_code=400, detail="Data pendaftaran tidak valid")
    except HTTPException:
        # Re-raise HTTP exceptions as they already have appropriate messages
        raise
    except Exception as e:
        # Log detailed error but return a generic message
        import traceback
        error_message = str(e)
        logger.error(f"Unhandled registration error: {error_message}")
        logger.error(traceback.format_exc())
        
        # Handle specific PostgreSQL errors
        if "duplicate key" in error_message and "users_username_key" in error_message:
            raise HTTPException(status_code=400, detail="Username sudah digunakan")
        elif "duplicate key" in error_message and "users_email_key" in error_message:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
        else:
            raise HTTPException(
                status_code=500, 
                detail="Terjadi kesalahan saat pendaftaran. Silakan coba lagi nanti."
            )

@router.post("/login", response_model=schemas.LoginResponse)
def login(user: schemas.UserLogin, session: Session = Depends(db.get_db)):
    try:
        db_user = crud.get_user_by_email(session, email=user.email)
        if not db_user:
            raise HTTPException(status_code=404, detail="Email tidak ditemukan")
        if not crud.verify_password(user.password, db_user.password_hash):
            raise HTTPException(status_code=401, detail="Password salah")
        
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
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Gagal login. Silakan coba lagi nanti."
        )

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: schemas.UserOut = Depends(auth_utils.get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    request: schemas.ChangePasswordRequest,
    session: Session = Depends(db.get_db),
    current_user: schemas.UserOut = Depends(auth_utils.get_current_user),
):
    try:
        db_user = crud.get_user_by_email(session, email=current_user.email)
        
        if not crud.verify_password(request.old_password, db_user.password_hash):
            raise HTTPException(status_code=401, detail="Password lama salah")

        db_user.password_hash = get_password_hash(request.new_password)
        session.commit()

        return {"message": "Password berhasil diubah"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Gagal mengubah password. Silakan coba lagi nanti."
        )