from app.auth import create_access_token as original_create_access_token 
def create_access_token(data: dict) -> str:
    return original_create_access_token(data)
