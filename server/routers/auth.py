import random
from fastapi import APIRouter, HTTPException, status, Depends, Header
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.security import hash_password, verify_password, create_access_token, verify_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


class AuthRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None


class VerifyRequest(BaseModel):
    email: str
    code: str


class ProfileUpdateRequest(BaseModel):
    username: str
    email: str
    role: str | None = None
    company: str | None = None


class ConfirmProfileUpdateRequest(BaseModel):
    newEmail: str | None = None
    newUsername: str | None = None
    newPassword: str | None = None
    role: str | None = None
    company: str | None = None
    code: str


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> models.User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token missing or invalid")
    
    token = authorization.split(" ")[1]
    payload = verify_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Session expired or token invalid. Please log in again.")
    
    user_email = payload["sub"]
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User account not found")
    
    return user


@router.get("/me")
def get_me(user: models.User = Depends(get_current_user)):
    return {
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role or "Business Owner",
            "company": user.company or "D2C Brand Store",
            "is_verified": user.is_verified
        }
    }


@router.post("/register")
def register(data: AuthRequest, db: Session = Depends(get_db)):
    if not data.password:
        raise HTTPException(status_code=400, detail="Password is required")

    user_identifier = data.username or (data.email.split('@')[0] if data.email else 'User')
    user_email = data.email or f"{user_identifier}@bizeye.local"

    conditions = []
    if user_identifier:
        conditions.append(models.User.username == user_identifier)
    if user_email:
        conditions.append(models.User.email == user_email)

    existing = db.query(models.User).filter(or_(*conditions)).first() if conditions else None
    if existing:
        if existing.is_verified:
            raise HTTPException(status_code=400, detail="Account with this username or email already exists")
        else:
            code = str(random.randint(100000, 999999))
            existing.password_hash = hash_password(data.password)
            existing.verification_code = code
            db.commit()
            return {
                "success": True,
                "requiresVerification": True,
                "email": existing.email,
                "verificationCode": code,
                "message": f"Verification code sent to {existing.email}"
            }

    otp_code = str(random.randint(100000, 999999))

    user = models.User(
        username=user_identifier,
        email=user_email,
        password_hash=hash_password(data.password),
        is_verified=False,
        verification_code=otp_code,
        role="Business Owner",
        company="D2C Brand Store"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "success": True,
        "requiresVerification": True,
        "email": user.email,
        "verificationCode": otp_code,
        "message": f"Verification code sent to {user.email}"
    }


@router.post("/verify")
def verify_email(data: VerifyRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        or_(models.User.email == data.email.strip(), models.User.username == data.email.strip())
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    if not user.verification_code or user.verification_code.strip() != data.code.strip():
        if not user.is_verified:
            raise HTTPException(status_code=400, detail="Invalid verification code. Please check and try again.")

    user.is_verified = True
    user.verification_code = None
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "user_id": user.id})

    return {
        "success": True,
        "message": "Email verified successfully!",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role or "Business Owner",
            "company": user.company or "D2C Brand Store"
        },
        "token": token
    }


@router.post("/login")
def login(data: AuthRequest, db: Session = Depends(get_db)):
    if not data.password:
        raise HTTPException(status_code=400, detail="Password is required")

    conditions = []
    if data.email:
        conditions.extend([models.User.email == data.email, models.User.username == data.email])
    if data.username:
        conditions.extend([models.User.username == data.username, models.User.email == data.username])

    if not conditions:
        raise HTTPException(status_code=400, detail="Email or username is required")

    user = db.query(models.User).filter(or_(*conditions)).first()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email/username or password")

    if not user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email address not verified yet. Please complete verification."
        )

    token = create_access_token({"sub": user.email, "user_id": user.id})

    return {
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role or "Business Owner",
            "company": user.company or "D2C Brand Store"
        },
        "token": token
    }


@router.put("/profile")
def update_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    # Check if email is changing
    if data.email.strip().lower() != user.email.strip().lower():
        otp_code = str(random.randint(100000, 999999))
        user.verification_code = otp_code
        db.commit()
        return {
            "success": True,
            "requiresVerification": True,
            "newEmail": data.email.strip(),
            "newUsername": data.username.strip(),
            "verificationCode": otp_code,
            "message": f"Security verification code sent to {data.email}"
        }

    user.username = data.username.strip()
    if data.role:
        user.role = data.role.strip()
    if data.company:
        user.company = data.company.strip()

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "requiresVerification": False,
        "message": "Profile updated in database successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "company": user.company
        }
    }


@router.post("/change-password-request")
def change_password_request(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    if not verify_password(data.currentPassword, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    otp_code = str(random.randint(100000, 999999))
    user.verification_code = otp_code
    db.commit()

    return {
        "success": True,
        "requiresVerification": True,
        "verificationCode": otp_code,
        "message": f"Verification code sent to {user.email}"
    }


@router.post("/confirm-profile-update")
def confirm_profile_update(
    data: ConfirmProfileUpdateRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    if not user.verification_code or user.verification_code.strip() != data.code.strip():
        raise HTTPException(status_code=400, detail="Invalid verification code. Please check and try again.")

    if data.newEmail:
        user.email = data.newEmail.strip()
    if data.newUsername:
        user.username = data.newUsername.strip()
    if data.newPassword:
        user.password_hash = hash_password(data.newPassword)
    if data.role:
        user.role = data.role.strip()
    if data.company:
        user.company = data.company.strip()

    user.verification_code = None
    user.is_verified = True
    db.commit()
    db.refresh(user)

    # Re-issue updated JWT token with new email if changed
    token = create_access_token({"sub": user.email, "user_id": user.id})

    return {
        "success": True,
        "message": "Changes authorized and saved successfully!",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "company": user.company
        },
        "token": token
    }
