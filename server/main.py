import logging
from datetime import datetime
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, upload, chat
from utils.waf import scan_for_malicious_content, rate_limiter

logger = logging.getLogger("bizeye_security")

# Automatically initialize database schema
Base.metadata.create_all(bind=engine)

# Hardened FastAPI instance: OpenAPI schema & docs strictly disabled in production
app = FastAPI(
    title="BizEye Backend API",
    description="Secure Business Intelligence API Server",
    version="1.0.0",
    docs_url=None,       # Disable Swagger UI to prevent endpoint enumeration
    redoc_url=None,      # Disable ReDoc
    openapi_url=None     # Disable openapi.json schema download
)

# Restrict CORS to trusted origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)


@app.middleware("http")
async def security_and_waf_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"

    # 1. Rate Limiting Protection (Anti-DDoS & Brute-Force Defender)
    if rate_limiter.is_rate_limited(client_ip):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Too many requests. Please slow down and try again later."}
        )

    # 2. SQL Injection & Exploits Firewall (inspect URL path & query parameters)
    raw_query = str(request.url.query)
    raw_path = str(request.url.path)
    
    is_malicious, threat_type = scan_for_malicious_content(raw_path + " " + raw_query)
    if is_malicious:
        logger.warning(f"Security Alert: Blocked {threat_type} attempt from IP {client_ip} on URL: {request.url}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": "Invalid or forbidden request parameter."}
        )

    # 3. Process Request
    response = await call_next(request)

    # 4. Strict Security Headers Enforcement
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"

    # Strip server information to prevent fingerprinting
    if "server" in response.headers:
        del response.headers["server"]

    return response


# Global sanitized error handler to prevent internal tracebacks or DB schema leaks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )


# Register API routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(chat.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
