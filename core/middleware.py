import logging
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import time


logger = logging.getLogger("app")

def register_middleware(app: FastAPI):
    origins=[""]
    app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


    @app.middleware("http")
    async def request_id_and_logging(request: Request, call_next):
        
        request_id= request.headers.get("X-Request-ID") or str(uuid.uuid4()) 
        request.state.request_id = request_id

        start = time.perf_counter()
        response = await call_next(request)
        duration = round((time.perf_counter()-start)*1000,2)
        response.headers["X-Request-ID"]=request_id 

        logger.info(
            "%s %s -> %s (%sms) rid=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration,
            request_id,
        )

        return response
