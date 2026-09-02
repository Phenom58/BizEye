import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta
import jwt

SECRET_KEY = os.getenv("JWT_SECRET", "bizeye_super_secret_jwt_key_2026_993847192")
ALGORITHM = "HS256"
DEFAULT_ITERATIONS = 600000


def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with 600,000 iterations (OWASP standard)."""
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, DEFAULT_ITERATIONS)
    return f"{DEFAULT_ITERATIONS}${salt.hex()}${pwd_hash.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Constant-time password verification supporting legacy & OWASP 600,000 iteration hashes."""
    try:
        parts = hashed_password.split('$')
        if len(parts) == 3:
            iterations = int(parts[0])
            salt_hex = parts[1]
            pwd_hash_hex = parts[2]
        elif len(parts) == 2:
            iterations = 100000  # Legacy fallback
            salt_hex = parts[0]
            pwd_hash_hex = parts[1]
        else:
            return False

        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(pwd_hash_hex)
        actual_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, iterations)
        return hmac.compare_digest(expected_hash, actual_hash)
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Generate cryptographically signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str) -> dict | None:
    """Verify cryptographically signed JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
