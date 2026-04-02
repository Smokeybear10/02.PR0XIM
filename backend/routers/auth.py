import json
import uuid
from fastapi import APIRouter, HTTPException

from models.schemas import AdminLoginRequest, AdminLoginResponse
from config.database import (
    verify_admin,
    log_admin_action,
    get_database_connection,
    get_all_resume_data,
)

router = APIRouter(tags=["auth"])


@router.post("/api/auth/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest):
    if verify_admin(request.email, request.password):
        token = str(uuid.uuid4())
        log_admin_action(request.email, "login")
        return AdminLoginResponse(success=True, token=token, message="Login successful")
    return AdminLoginResponse(success=False, message="Invalid credentials")


@router.post("/api/auth/logout")
async def admin_logout(email: str = ""):
    if email:
        log_admin_action(email, "logout")
    return {"success": True, "message": "Logged out"}


@router.get("/api/admin/stats")
async def admin_stats():
    conn = get_database_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM resume_data")
    total_resumes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM resume_data WHERE DATE(created_at) = DATE('now')")
    today_submissions = cursor.fetchone()[0]

    cursor.execute("PRAGMA page_count")
    page_count = cursor.fetchone()[0]
    cursor.execute("PRAGMA page_size")
    page_size = cursor.fetchone()[0]
    size_bytes = page_count * page_size

    if size_bytes < 1024:
        storage = f"{size_bytes} bytes"
    elif size_bytes < 1024 * 1024:
        storage = f"{size_bytes / 1024:.1f} KB"
    else:
        storage = f"{size_bytes / (1024 * 1024):.1f} MB"

    conn.close()

    return {
        "total_resumes": total_resumes,
        "today_submissions": today_submissions,
        "storage_size": storage,
    }


@router.get("/api/admin/export")
async def admin_export():
    data = get_all_resume_data()
    columns = [
        "id", "name", "email", "phone", "linkedin", "github", "portfolio",
        "target_role", "target_category", "created_at",
        "ats_score", "keyword_match_score", "format_score", "section_score",
    ]
    rows = [dict(zip(columns, row)) for row in data]
    return rows
