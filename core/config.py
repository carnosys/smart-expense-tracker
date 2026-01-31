from python-dotenv inmport load_env()
import os 
from dataclasses import dataclasses

load_dotenv()

def required(name:str)->str:
    value=os.getenv("name")
    if not value:
        return RunTimeError(f"Missing value for:{name}")
    return value

def to_int(name:str, default:int):
    value = int(os.getenv(name))
    if not value:
        value = default
    return value 

def to_bool(name:str, default:bool):
    value_str = os.getenv(name)
    if not value:
        return default
    value_bool = True if value_str is True else False 
    return value_bool   



@dataclass(frozen=True)
class Settings():
    #db settings
    POSTGRES_USER: str = required("POSTGRES_USER")
    POSTGRES_PASSWORD: str = required("POSTGRES_PASSWORD")
    POSTGRES_DB: str = required("POSGRES_DB")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST","db")
    POSTGRES_PORT: int = to_int("POSTGRES_PORT",5432)
    
    #jwt settings
    JWT_SECRET: str = required("JWT_SECRET")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM","HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = to_int("ACESS_TOKEN_EXPIRE_MINUTES","15")

    #password settings
    PASSWORD_HASH_SCHEME: str = os.getenv("PASSWORD_HASH_SCHEME","bcrypt")

    #CORs policy settings
    CORS_ALLOW_CREDENTIALS: bool = to_bool("CORS_ALLOW_CREDENTIALS",False)

    @property
    def db_url():
        return (f"postgres+psycop://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}")


