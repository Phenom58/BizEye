from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, upload

# Automatically initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BizEye FastAPI Backend",
    description="Business Intelligence API Server powered by FastAPI",
    version="1.0.0",
    docs_url="/docs" if False else None,  # Hide interactive docs in production for security
    redoc_url=None
)

# Restrict CORS to local development origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Register API routers
app.include_router(auth.router)
app.include_router(upload.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "backend": "FastAPI",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
