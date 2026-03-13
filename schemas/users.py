from pydantic import BaseModel, EmailStr
import datetime

class UserCreate(BaseModel):
    username : str
    email : EmailStr
    password: str 


class UserOut(BaseModel):
    id:int
    username:str
    email: EmailStr
    created_at: datetime.datetime    
    
    class Config:
        from_attributes =  True


class UserLogin(BaseModel):
    email : EmailStr
    password : str        


class TokenOut(BaseModel):
    access_token : str
    token_type : str   

    class Config:
        from_attributes = True 