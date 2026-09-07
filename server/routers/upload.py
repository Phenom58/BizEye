import os
import re
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from database import SessionLocal
import models
from utils.csv_parser import parse_and_compute_analytics_fast

router = APIRouter(prefix="/api/upload", tags=["upload"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB limit


def sanitize_filename(name: str) -> str:
    base = os.path.basename(name.replace("\\", "/"))
    safe_name = re.sub(r'[^a-zA-Z0-9_\-\. ]', '_', base)
    return safe_name[:120]


def save_dataset_background(filename: str, analytics: dict):
    db = SessionLocal()
    try:
        dataset_record = models.Dataset(
            filename=filename,
            analytics_data=analytics
        )
        db.add(dataset_record)
        db.commit()
    except Exception as e:
        print(f"DB Notice: Background dataset persistence notice: {e}")
    finally:
        db.close()


@router.post("")
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if not file.filename or not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    safe_name = sanitize_filename(file.filename)

    # Read bytes efficiently
    content_bytes = await file.read(MAX_FILE_SIZE + 1024)
    if len(content_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum allowed size is 50MB.")

    try:
        content_str = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        content_str = content_bytes.decode('latin-1', errors='ignore')

    # Instantaneous streaming validation and KPI calculation
    success, err_msg, analytics, row_count = parse_and_compute_analytics_fast(content_str)
    if not success:
        raise HTTPException(status_code=400, detail=err_msg)

    # Non-blocking background persistence
    background_tasks.add_task(save_dataset_background, safe_name, analytics)

    return {
        "success": True,
        "message": "Dataset processed and analyzed in real time",
        "filename": safe_name,
        "rowCount": row_count,
        "data": analytics
    }
