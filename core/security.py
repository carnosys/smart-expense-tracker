from config import settings
from typing import Optional 

import jwt 
from jwt.exceptions import InvalidTokenError

from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, Depends, status 
from pwdlib import PasswordHash

from datetime import datetime, timedelta, timezone

password_hash = PasswordHash.recommended()

#Password Hashing

def hash_password(plaintext:str)->str:
    return password_hash.hash(plaintext)

def verify_hashed_password(plaintext:str, hashed_password:str)->bool:
    return password_hash.verify(plaintext,hashed_password)

oauth2_scheme = OAuth2PasswordBearer(token="/token")

#JWT creation

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None):
    expire = timedate.now(timezone.utc) + (expires_delta  or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {
        "sub":subject,
        "exp":expire,
        "iat":timedate.now(timezone.utc)
    }

    token = jwt.encode(payload, algorithm = settings.JWT_ALGORITHM, key = settings.JWT_SECRET)
    return token


#JWT verfication

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, algorithms=settings.JWT_ALGORITHM, key = settings.JWT_SECRET)
        return payload
    except InvalidTokenError:
        raise HTTPException(
           status_code = status.HTTP_401_UNAUTHORIZED,
           details = "Could not verify credentials",
           headers ={"WWW-Authenticate":"Bearer"}
        )    


 
#Current user dependency

async def get_current_user(token: str = Depends(outh2_scheme)):
    payload = decode_access_token(token)
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            details="Token missing subject",
                            headers={"WWW-Authentication" :"Bearer"}
                            )
 

    #DB logic to get user by name
    #BY default User=None
    user = None
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            details="User does not exist",
            headers={"WWW-Authentication":"Bearer"}
        )
    
    return user    