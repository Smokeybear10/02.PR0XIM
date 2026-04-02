from fastapi import APIRouter

from models.schemas import JobSearchRequest, JobSearchResult

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


class JobPortal:
    def __init__(self):
        self.portals = [
            {
                "name": "LinkedIn",
                "icon": "fab fa-linkedin",
                "color": "#33FF33",
                "url": "https://www.linkedin.com/jobs/search/?keywords={}&location={}&f_E={}",
            },
            {
                "name": "Naukri",
                "icon": "fas fa-building",
                "color": "#FF7555",
                "url": "https://www.naukri.com/{}-jobs-in-{}?experience={}",
            },
            {
                "name": "Foundit (Monster)",
                "icon": "fas fa-globe",
                "color": "#5D3FD3",
                "url": "https://www.foundit.in/srp/results?query={}&locations={}",
            },
            {
                "name": "FreshersWorld",
                "icon": "fas fa-graduation-cap",
                "color": "#003A9B",
                "url": "https://www.freshersworld.com/jobs/jobsearch/{}-jobs-in-{}",
            },
            {
                "name": "TimesJobs",
                "icon": "fas fa-briefcase",
                "color": "#003A9B",
                "url": "https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords={}&txtLocation={}",
            },
            {
                "name": "Instahyre",
                "icon": "fas fa-user-tie",
                "color": "#003A9B",
                "url": "https://www.instahyre.com/{}-jobs-in-{}",
            },
            {
                "name": "Indeed",
                "icon": "fas fa-search-dollar",
                "color": "#003A9B",
                "url": "https://in.indeed.com/jobs?q={}&l={}&explvl={}",
            },
        ]

    def search_jobs(self, job_title: str, location: str, experience: str | None = None) -> list[dict]:
        results = []
        loc = location or "India"

        for portal in self.portals:
            name = portal["name"]

            if name in ("LinkedIn", "Indeed", "TimesJobs"):
                fmt_job = job_title.replace(" ", "%20")
                fmt_loc = loc.replace(" ", "%20")
            elif name in ("FreshersWorld", "Instahyre"):
                fmt_job = job_title.lower().replace(" ", "-")
                fmt_loc = loc.lower().replace(" ", "-")
            elif name == "Naukri":
                fmt_job = job_title.lower().replace(" ", "-")
                fmt_loc = loc.lower().replace(" ", "-")
            else:
                fmt_job = job_title.replace(" ", "+")
                fmt_loc = loc.replace(" ", "+")

            try:
                if name == "Foundit (Monster)":
                    url = portal["url"].format(fmt_job, fmt_loc)
                else:
                    url = portal["url"].format(fmt_job, fmt_loc, experience or "")
            except Exception:
                url = portal["url"]

            results.append({
                "portal": name,
                "icon": portal["icon"],
                "color": portal["color"],
                "title": f"{job_title} jobs in {loc}",
                "url": url,
            })

        return results


FEATURED_COMPANIES = {
    "tech": [
        {"name": "Google", "icon": "fab fa-google", "color": "#4285F4", "careers_url": "https://careers.google.com", "description": "Leading technology company known for search, cloud, and innovation", "categories": ["Software", "AI/ML", "Cloud", "Data Science"]},
        {"name": "Microsoft", "icon": "fab fa-microsoft", "color": "#00A4EF", "careers_url": "https://careers.microsoft.com", "description": "Global leader in software, cloud, and enterprise solutions", "categories": ["Software", "Cloud", "Gaming", "Enterprise"]},
        {"name": "Amazon", "icon": "fab fa-amazon", "color": "#FF9900", "careers_url": "https://www.amazon.jobs", "description": "E-commerce and cloud computing giant", "categories": ["Software", "Operations", "Cloud", "Retail"]},
        {"name": "Apple", "icon": "fab fa-apple", "color": "#555555", "careers_url": "https://www.apple.com/careers", "description": "Innovation leader in consumer technology", "categories": ["Software", "Hardware", "Design", "AI/ML"]},
        {"name": "Netflix", "icon": "fas fa-play-circle", "color": "#E50914", "careers_url": "https://explore.jobs.netflix.net/careers", "description": "Streaming media company", "categories": ["Software", "Marketing", "Design", "Service"]},
    ],
    "indian_tech": [
        {"name": "TCS", "icon": "fas fa-building", "color": "#0070C0", "careers_url": "https://www.tcs.com/careers", "description": "India's largest IT services company", "categories": ["IT Services", "Consulting", "Digital"]},
        {"name": "Infosys", "icon": "fas fa-building", "color": "#007CC3", "careers_url": "https://www.infosys.com/careers", "description": "Global leader in digital services and consulting", "categories": ["IT Services", "Consulting", "Digital"]},
        {"name": "Wipro", "icon": "fas fa-building", "color": "#341F65", "careers_url": "https://careers.wipro.com", "description": "Leading global information technology company", "categories": ["IT Services", "Consulting", "Digital"]},
        {"name": "HCL", "icon": "fas fa-building", "color": "#0075C9", "careers_url": "https://www.hcltech.com/careers", "description": "Global technology company", "categories": ["IT Services", "Engineering", "Digital"]},
    ],
    "global_corps": [
        {"name": "IBM", "icon": "fas fa-server", "color": "#1F70C1", "careers_url": "https://www.ibm.com/careers", "description": "Global leader in technology and consulting", "categories": ["Software", "Consulting", "AI/ML", "Cloud"]},
        {"name": "Accenture", "icon": "fas fa-building", "color": "#A100FF", "careers_url": "https://www.accenture.com/careers", "description": "Global professional services company", "categories": ["Consulting", "Technology", "Digital"]},
        {"name": "Cognizant", "icon": "fas fa-building", "color": "#1299D8", "careers_url": "https://careers.cognizant.com", "description": "Leading professional services company", "categories": ["IT Services", "Consulting", "Digital"]},
    ],
}

JOB_MARKET_INSIGHTS = {
    "trending_skills": [
        {"name": "Artificial Intelligence", "growth": "+45%", "icon": "fas fa-brain"},
        {"name": "Cloud Computing", "growth": "+38%", "icon": "fas fa-cloud"},
        {"name": "Data Science", "growth": "+35%", "icon": "fas fa-chart-line"},
        {"name": "Cybersecurity", "growth": "+32%", "icon": "fas fa-shield-alt"},
        {"name": "DevOps", "growth": "+30%", "icon": "fas fa-code-branch"},
        {"name": "Machine Learning", "growth": "+28%", "icon": "fas fa-robot"},
    ],
    "top_locations": [
        {"name": "Bangalore", "jobs": "50,000+", "icon": "fas fa-city"},
        {"name": "Mumbai", "jobs": "35,000+", "icon": "fas fa-city"},
        {"name": "Delhi NCR", "jobs": "30,000+", "icon": "fas fa-city"},
        {"name": "Hyderabad", "jobs": "25,000+", "icon": "fas fa-city"},
        {"name": "Pune", "jobs": "20,000+", "icon": "fas fa-city"},
        {"name": "Chennai", "jobs": "15,000+", "icon": "fas fa-city"},
    ],
    "salary_insights": [
        {"role": "Machine Learning Engineer", "range": "10-35 LPA", "experience": "0-5 years"},
        {"role": "Software Engineer", "range": "5-25 LPA", "experience": "0-5 years"},
        {"role": "Data Scientist", "range": "8-30 LPA", "experience": "0-5 years"},
        {"role": "DevOps Engineer", "range": "6-28 LPA", "experience": "0-5 years"},
        {"role": "UI/UX Designer", "range": "5-25 LPA", "experience": "0-5 years"},
    ],
}

job_portal = JobPortal()


@router.post("/search", response_model=list[JobSearchResult])
async def search_jobs(request: JobSearchRequest):
    experience_param = None
    if request.experience:
        experience_param = request.experience

    results = job_portal.search_jobs(request.query, request.location, experience_param)
    return results


@router.get("/companies")
async def get_companies(category: str | None = None):
    if category and category in FEATURED_COMPANIES:
        return FEATURED_COMPANIES[category]
    return [c for companies in FEATURED_COMPANIES.values() for c in companies]


@router.get("/insights")
async def get_insights():
    return JOB_MARKET_INSIGHTS
