from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine 
from core.config import settings


engine = create_async_engine(settings.db_url,pool_size=5, max_overflow=10)

AsyncSessionLocal = sessionmaker(bind = engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()    