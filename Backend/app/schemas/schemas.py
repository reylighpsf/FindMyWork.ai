from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ----- User-related schemas -----
class UserBase(BaseModel):
    email: str
    username: str
    name: str

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

# ----- History-related schemas -----
class HistoryBase(BaseModel):
    cv_text: str
    analysis: str

class HistoryCreate(HistoryBase):
    pass

# Model untuk response dari database
class HistoryResponse(HistoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
