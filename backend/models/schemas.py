from pydantic import BaseModel
from typing import Optional


class AnalyzeRequest(BaseModel):
    job_category: str
    job_role: str
    resume_text: str


class KeywordMatch(BaseModel):
    score: float
    found_skills: list[str]
    missing_skills: list[str]


class SectionScores(BaseModel):
    contact: float = 0
    summary: float = 0
    skills: float = 0
    experience: float = 0
    education: float = 0
    format: float = 0


class AnalyzeResponse(BaseModel):
    ats_score: float
    keyword_match: KeywordMatch
    format_score: float
    section_score: float
    suggestions: list[str]
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    document_type: str = "resume"
    education: list[str] = []
    experience: list[str] = []
    projects: list[str] = []
    skills: list[str] = []
    summary: str = ""
    section_scores: Optional[SectionScores] = None
    contact_suggestions: list[str] = []
    summary_suggestions: list[str] = []
    skills_suggestions: list[str] = []
    experience_suggestions: list[str] = []
    education_suggestions: list[str] = []
    format_suggestions: list[str] = []


class AIAnalyzeRequest(BaseModel):
    job_role: str
    resume_text: str
    job_description: Optional[str] = None
    model: str = "Google Gemini"


class AIAnalyzeResponse(BaseModel):
    resume_score: int = 0
    ats_score: int = 0
    analysis: str = ""
    model_used: str = ""
    error: Optional[str] = None


class FeedbackRequest(BaseModel):
    rating: int
    usability_score: int
    feature_satisfaction: int
    missing_features: str = ""
    improvement_suggestions: str = ""
    user_experience: str = ""


class FeedbackStats(BaseModel):
    avg_rating: float
    avg_usability: float
    avg_satisfaction: float
    total_responses: int


class JobSearchRequest(BaseModel):
    query: str
    location: str = ""
    experience: Optional[str] = None


class JobSearchResult(BaseModel):
    portal: str
    title: str
    url: str
    icon: str
    color: str


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    success: bool
    token: str = ""
    message: str = ""


class PeriodMetrics(BaseModel):
    total_resumes: int = 0
    avg_ats_score: float = 0
    avg_keyword_score: float = 0
    high_scoring: int = 0


class DashboardMetrics(BaseModel):
    today: PeriodMetrics = PeriodMetrics()
    this_week: PeriodMetrics = PeriodMetrics()
    this_month: PeriodMetrics = PeriodMetrics()
    all_time: PeriodMetrics = PeriodMetrics()


class PersonalInfo(BaseModel):
    full_name: str
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    location: str = ""
    title: str = ""


class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str
    description: str = ""
    responsibilities: list[str] = []


class Education(BaseModel):
    school: str
    degree: str
    field: str
    graduation_date: str
    gpa: str = ""


class Project(BaseModel):
    name: str
    technologies: str = ""
    description: str = ""
    responsibilities: list[str] = []


class SkillsCategories(BaseModel):
    technical: list[str] = []
    soft: list[str] = []
    languages: list[str] = []
    tools: list[str] = []


class ResumeBuilderRequest(BaseModel):
    personal_info: PersonalInfo
    summary: str = ""
    experience: list[Experience] = []
    education: list[Education] = []
    projects: list[Project] = []
    skills: SkillsCategories = SkillsCategories()
    template: str = "modern"
