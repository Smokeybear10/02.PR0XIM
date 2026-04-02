from datetime import datetime, timedelta
from fastapi import APIRouter

from config.database import get_database_connection
from models.schemas import DashboardMetrics, PeriodMetrics

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
async def get_metrics():
    conn = get_database_connection()
    cursor = conn.cursor()

    now = datetime.now()
    periods = {
        "today": now.replace(hour=0, minute=0, second=0, microsecond=0),
        "this_week": now - timedelta(days=now.weekday()),
        "this_month": now.replace(day=1),
        "all_time": datetime(2000, 1, 1),
    }

    result = {}
    for key, start_date in periods.items():
        cursor.execute(
            """
            SELECT
                COUNT(DISTINCT rd.id) as total_resumes,
                ROUND(AVG(ra.ats_score), 1) as avg_ats_score,
                ROUND(AVG(ra.keyword_match_score), 1) as avg_keyword_score,
                COUNT(DISTINCT CASE WHEN ra.ats_score >= 70 THEN rd.id END) as high_scoring
            FROM resume_data rd
            LEFT JOIN resume_analysis ra ON rd.id = ra.resume_id
            WHERE rd.created_at >= ?
            """,
            (start_date.strftime("%Y-%m-%d %H:%M:%S"),),
        )
        row = cursor.fetchone()
        result[key] = PeriodMetrics(
            total_resumes=row[0] or 0,
            avg_ats_score=row[1] or 0,
            avg_keyword_score=row[2] or 0,
            high_scoring=row[3] or 0,
        )

    conn.close()
    return DashboardMetrics(**result)


@router.get("/skills")
async def get_skill_distribution():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("""
        WITH RECURSIVE split(skill, rest) AS (
            SELECT '', skills || ','
            FROM resume_data
            UNION ALL
            SELECT
                substr(rest, 0, instr(rest, ',')),
                substr(rest, instr(rest, ',') + 1)
            FROM split
            WHERE rest <> ''
        ),
        SkillCategories AS (
            SELECT
                CASE
                    WHEN LOWER(TRIM(skill, '[]" ')) LIKE '%python%' OR LOWER(TRIM(skill, '[]" ')) LIKE '%java%' OR
                         LOWER(TRIM(skill, '[]" ')) LIKE '%javascript%' OR LOWER(TRIM(skill, '[]" ')) LIKE '%c++%' OR
                         LOWER(TRIM(skill, '[]" ')) LIKE '%programming%' THEN 'Programming'
                    WHEN LOWER(TRIM(skill, '[]" ')) LIKE '%sql%' OR LOWER(TRIM(skill, '[]" ')) LIKE '%database%' OR
                         LOWER(TRIM(skill, '[]" ')) LIKE '%mongodb%' THEN 'Database'
                    WHEN LOWER(TRIM(skill, '[]" ')) LIKE '%aws%' OR LOWER(TRIM(skill, '[]" ')) LIKE '%cloud%' OR
                         LOWER(TRIM(skill, '[]" ')) LIKE '%azure%' THEN 'Cloud'
                    WHEN LOWER(TRIM(skill, '[]" ')) LIKE '%agile%' OR LOWER(TRIM(skill, '[]" ')) LIKE '%scrum%' OR
                         LOWER(TRIM(skill, '[]" ')) LIKE '%management%' THEN 'Management'
                    ELSE 'Other'
                END as category,
                COUNT(*) as count
            FROM split
            WHERE skill <> ''
            GROUP BY category
        )
        SELECT category, count
        FROM SkillCategories
        ORDER BY count DESC
    """)

    categories = []
    counts = []
    for row in cursor.fetchall():
        categories.append(row[0])
        counts.append(row[1])

    conn.close()
    return {"categories": categories, "counts": counts}


@router.get("/trends")
async def get_weekly_trends():
    conn = get_database_connection()
    cursor = conn.cursor()
    now = datetime.now()
    dates = [(now - timedelta(days=x)).strftime("%Y-%m-%d") for x in range(6, -1, -1)]

    submissions = []
    for date in dates:
        cursor.execute(
            "SELECT COUNT(*) FROM resume_data WHERE DATE(created_at) = DATE(?)",
            (date,),
        )
        submissions.append(cursor.fetchone()[0])

    conn.close()
    return {"dates": [d[-5:] for d in dates], "submissions": submissions}


@router.get("/categories")
async def get_category_stats():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            COALESCE(target_category, 'Other') as category,
            COUNT(*) as count,
            ROUND(AVG(CASE WHEN ra.ats_score >= 70 THEN 1 ELSE 0 END) * 100, 1) as success_rate
        FROM resume_data rd
        LEFT JOIN resume_analysis ra ON rd.id = ra.resume_id
        GROUP BY category
        ORDER BY count DESC
        LIMIT 5
    """)

    categories = []
    success_rates = []
    for row in cursor.fetchall():
        categories.append(row[0])
        success_rates.append(row[2] or 0)

    conn.close()
    return {"categories": categories, "success_rates": success_rates}
