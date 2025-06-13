import logging
from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from passlib.context import CryptContext
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    try:
        # Check for duplicate email
        existing_email = get_user_by_email(db, email=user.email)
        if existing_email:
            raise ValueError("Email sudah terdaftar")
            
        # Check for duplicate username
        existing_username = get_user_by_username(db, username=user.username)
        if existing_username:
            raise ValueError("Username sudah digunakan")
            
        hashed_password = pwd_context.hash(user.password)
        db_user = models.User(
            name=user.name,
            email=user.email,
            username=user.username,
            password_hash=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError as e:
        db.rollback()
        error_msg = str(e)
        logger.error(f"Integrity error creating user: {error_msg}")
        
        if "users_username_key" in error_msg:
            raise ValueError("Username sudah digunakan")
        elif "users_email_key" in error_msg:
            raise ValueError("Email sudah terdaftar")
        else:
            raise ValueError(f"Database constraint error: {error_msg}")
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating user: {str(e)}")
        raise ValueError(f"Database error: {str(e)}")
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error creating user: {str(e)}")
        raise ValueError(f"Error creating user: {str(e)}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)