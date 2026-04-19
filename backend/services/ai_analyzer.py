import os
import re
import json
import tempfile
import logging
import requests
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

XAI_BASE_URL = "https://api.x.ai/v1"


class AIResumeAnalyzer:
    def __init__(self):
        load_dotenv()
        self.xai_api_key = os.getenv("XAI_API_KEY")
        self.xai_model = os.getenv("XAI_MODEL", "grok-4-fast-non-reasoning")

    def extract_text_from_pdf(self, pdf_file) -> str:
        text = ""

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            if hasattr(pdf_file, "read"):
                temp_file.write(pdf_file.read())
                pdf_file.seek(0)
            else:
                temp_file.write(pdf_file)
            temp_path = temp_file.name

        try:
            # Try pdfplumber first
            try:
                import pdfplumber
                import warnings

                with pdfplumber.open(temp_path) as pdf:
                    for page in pdf.pages:
                        with warnings.catch_warnings():
                            warnings.filterwarnings("ignore", message=".*PDFColorSpace.*")
                            warnings.filterwarnings("ignore", message=".*Cannot convert.*")
                            page_text = page.extract_text()
                            if page_text:
                                text += page_text + "\n"
            except Exception as e:
                logger.warning(f"pdfplumber extraction failed: {e}")

            if text.strip():
                os.unlink(temp_path)
                return text.strip()

            # Fallback to pypdf
            logger.info("Trying pypdf extraction method...")
            try:
                import pypdf

                pdf_text = ""
                with open(temp_path, "rb") as f:
                    pdf_reader = pypdf.PdfReader(f)
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            pdf_text += page_text + "\n"

                if pdf_text.strip():
                    os.unlink(temp_path)
                    return pdf_text.strip()
            except Exception as e:
                logger.warning(f"pypdf extraction failed: {e}")

            logger.warning("All text extraction methods failed for PDF.")

        except Exception as e:
            logger.error(f"PDF processing failed: {e}")

        try:
            os.unlink(temp_path)
        except OSError:
            pass

        return ""

    def extract_text_from_docx(self, docx_file) -> str:
        from docx import Document

        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_file:
            if hasattr(docx_file, "read"):
                temp_file.write(docx_file.read())
                docx_file.seek(0)
            else:
                temp_file.write(docx_file)
            temp_path = temp_file.name

        text = ""
        try:
            doc = Document(temp_path)
            text = "\n".join(para.text for para in doc.paragraphs)
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {e}")

        os.unlink(temp_path)
        return text

    def analyze_resume_with_ai(
        self,
        resume_text: str,
        job_description: str | None = None,
        job_role: str | None = None,
    ) -> dict:
        if not resume_text:
            return {"error": "Resume text is required for analysis."}

        if not self.xai_api_key:
            return {"error": "XAI_API_KEY is not configured. Add it to your .env file."}

        system_prompt = (
            "You are a senior resume reviewer with deep knowledge of ATS systems, "
            "industry hiring standards, and modern tech / business roles. You return "
            "strictly valid JSON matching the requested schema."
        )

        role_line = f"The candidate is targeting: {job_role}." if job_role else ""
        jd_line = f"\nTarget job description:\n{job_description}\n" if job_description else ""

        user_prompt = f"""Analyze this resume and return ONE JSON object with this exact shape:

{{
  "resume_score": <integer 0-100 overall quality>,
  "ats_score": <integer 0-100 ATS parse-ability + keyword match>,
  "strengths": [<5-7 short, specific strings about what the resume does well>],
  "weaknesses": [<5-7 short, specific, actionable strings about what to improve>],
  "analysis": "<markdown report: Overall Assessment, Professional Profile, Skills Analysis, Experience, Education, Role Alignment, ATS Optimization, Recommended Actions. 400-700 words.>"
}}

Rules:
- resume_score: holistic quality 0-100, not inflated. Average resumes land 55-70.
- ats_score: how well it would survive an ATS filter for the target role.
- strengths / weaknesses must be concrete (cite bullets, sections, metrics), not generic.
- analysis is markdown only; do NOT include the JSON keys inside analysis.
- Return ONLY the JSON object. No code fences. No preamble.

{role_line}{jd_line}
Resume:
---
{resume_text}
---"""

        try:
            resp = requests.post(
                f"{XAI_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.xai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.xai_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.3,
                    "response_format": {"type": "json_object"},
                },
                timeout=60,
            )
        except requests.RequestException as e:
            return {"error": f"xAI request failed: {e}"}

        if resp.status_code != 200:
            return {"error": f"xAI returned {resp.status_code}: {resp.text[:300]}"}

        try:
            payload = resp.json()
            raw = payload["choices"][0]["message"]["content"]
            data = json.loads(raw)
        except (KeyError, ValueError, json.JSONDecodeError) as e:
            logger.error("Failed to parse xAI response: %s", e)
            return {"error": "xAI returned unparseable output."}

        return {
            "resume_score": self._clamp(data.get("resume_score", 0)),
            "ats_score": self._clamp(data.get("ats_score", 0)),
            "strengths": list(data.get("strengths", []))[:7],
            "weaknesses": list(data.get("weaknesses", []))[:7],
            "analysis": str(data.get("analysis", "")).strip(),
        }

    @staticmethod
    def _clamp(v) -> int:
        try:
            return max(0, min(int(v), 100))
        except (TypeError, ValueError):
            return 0

    def _extract_score_from_text(self, analysis_text: str) -> int:
        try:
            if "## Resume Score" in analysis_text:
                score_section = analysis_text.split("## Resume Score")[1].strip()
                score_match = re.search(r"Resume Score:\s*(\d{1,3})/100", score_section)
                if score_match:
                    return max(0, min(int(score_match.group(1)), 100))

                score_match = re.search(r"\b(\d{1,3})\b", score_section)
                if score_match:
                    return max(0, min(int(score_match.group(1)), 100))

            score_match = re.search(r"Resume Score:\s*(\d{1,3})/100", analysis_text)
            if score_match:
                return max(0, min(int(score_match.group(1)), 100))

            return 0
        except Exception as e:
            logger.error(f"Error extracting score: {e}")
            return 0

    def _extract_ats_score_from_text(self, analysis_text: str) -> int:
        try:
            if "## ATS Optimization Assessment" in analysis_text:
                ats_section = analysis_text.split("## ATS Optimization Assessment")[1].split("##")[0].strip()
                score_match = re.search(r"ATS Score:\s*(\d{1,3})/100", ats_section)
                if score_match:
                    return max(0, min(int(score_match.group(1)), 100))
            return 0
        except Exception as e:
            logger.error(f"Error extracting ATS score: {e}")
            return 0
