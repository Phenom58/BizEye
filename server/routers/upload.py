import os
import re
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.csv_parser import validate_csv_headers, parse_csv, compute_analytics

router = APIRouter(prefix="/api/upload", tags=["upload"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB limit


def sanitize_filename(name: str) -> str:
    """Sanitize uploaded file name against directory traversal and null byte injection."""
    base = os.path.basename(name.replace("\\", "/"))
    # Keep only safe alphanumeric, dash, underscore, and dot characters
    safe_name = re.sub(r'[^a-zA-Z0-9_\-\. ]', '_', base)
    return safe_name[:120]


@router.post("")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")

    safe_name = sanitize_filename(file.filename)

    # Read up to max file size to prevent memory exhaustion
    content_bytes = await file.read(MAX_FILE_SIZE + 1024)
    if len(content_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum allowed size is 50MB.")

    try:
        content_str = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        content_str = content_bytes.decode('latin-1', errors='ignore')

    validation = validate_csv_headers(content_str)
    if not validation['valid']:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(validation['missing'])}"
        )

    rows = parse_csv(content_str)
    if not rows:
        raise HTTPException(status_code=400, detail="No valid data rows found in CSV file.")

    analytics = compute_analytics(rows)

    # Persist dataset record
    dataset_id = None
    try:
        dataset_record = models.Dataset(
            filename=safe_name,
            analytics_data=analytics
        )
        db.add(dataset_record)
        db.commit()
        db.refresh(dataset_record)
        dataset_id = dataset_record.id
    except Exception as e:
        print(f"DB Notice: Could not persist dataset record: {e}")

    return {
        "success": True,
        "message": "Dataset processed and analyzed successfully",
        "datasetId": dataset_id,
        "filename": safe_name,
        "rowCount": len(rows),
        "data": analytics
    }
