from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config.database import init_database
from routers import analyze, jobs, feedback, dashboard, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    yield


app = FastAPI(title="DR4FT API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:2200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(jobs.router)
app.include_router(feedback.router)
app.include_router(dashboard.router)
app.include_router(auth.router)


@app.get("/")
async def root():
    return {"message": "DR4FT API is running"}
