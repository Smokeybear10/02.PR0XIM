import sqlite3
import os
from datetime import datetime
from fastapi import APIRouter

from models.schemas import FeedbackRequest, FeedbackStats

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

DB_PATH = os.getenv("FEEDBACK_DB_PATH", "feedback.db")


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rating INTEGER,
            usability_score INTEGER,
            feature_satisfaction INTEGER,
            missing_features TEXT,
            improvement_suggestions TEXT,
            user_experience TEXT,
            timestamp DATETIME
        )
    """)
    conn.commit()
    return conn


@router.post("")
async def submit_feedback(request: FeedbackRequest):
    conn = _get_conn()
    try:
        conn.execute(
            """INSERT INTO feedback
               (rating, usability_score, feature_satisfaction,
                missing_features, improvement_suggestions,
                user_experience, timestamp)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                request.rating,
                request.usability_score,
                request.feature_satisfaction,
                request.missing_features,
                request.improvement_suggestions,
                request.user_experience,
                datetime.now().isoformat(),
            ),
        )
        conn.commit()
        return {"success": True, "message": "Feedback submitted"}
    finally:
        conn.close()


@router.get("/stats", response_model=FeedbackStats)
async def feedback_stats():
    conn = _get_conn()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM feedback")
        total = cursor.fetchone()[0]

        if total == 0:
            return FeedbackStats(avg_rating=0, avg_usability=0, avg_satisfaction=0, total_responses=0)

        cursor.execute(
            "SELECT AVG(rating), AVG(usability_score), AVG(feature_satisfaction) FROM feedback"
        )
        row = cursor.fetchone()
        return FeedbackStats(
            avg_rating=round(row[0] or 0, 2),
            avg_usability=round(row[1] or 0, 2),
            avg_satisfaction=round(row[2] or 0, 2),
            total_responses=total,
        )
    finally:
        conn.close()
