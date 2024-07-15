from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from database.schemas import TokenData
from core.config import get_settings

settings = get_settings()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        login_id: str = payload.get("sub")
        if login_id is None:
            raise credentials_exception
        token_data = TokenData(login_id=login_id)
    except JWTError:
        raise credentials_exception
    return token_data

