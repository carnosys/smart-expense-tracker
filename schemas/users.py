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
    created_at: datetime.time    
    
    class Config:
        from_attributes =  True