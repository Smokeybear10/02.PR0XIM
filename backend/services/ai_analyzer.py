import os
import re
import tempfile
import logging
from dotenv import load_dotenv
import google.generativeai as genai

logger = logging.getLogger(__name__)


class AIResumeAnalyzer:
    def __init__(self):
        load_dotenv()
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if self.google_api_key:
            genai.configure(api_key=self.google_api_key)

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

    def analyze_resume_with_gemini(
        self,
        resume_text: str,
        job_description: str | None = None,
        job_role: str | None = None,
    ) -> dict:
        if not resume_text:
            return {"error": "Resume text is required for analysis."}

        if not self.google_api_key:
            return {"error": "Google API key is not configured. Please add it to your .env file."}

        try:
            model = genai.GenerativeModel("gemini-1.5-flash")

            base_prompt = f"""
            You are an expert resume analyst with deep knowledge of industry standards, job requirements, and hiring practices across various fields. Your task is to provide a comprehensive, detailed analysis of the resume provided.

            Please structure your response in the following format:

            ## Overall Assessment
            [Provide a detailed assessment of the resume's overall quality, effectiveness, and alignment with industry standards.]

            ## Professional Profile Analysis
            [Analyze the candidate's professional profile, experience trajectory, and career narrative.]

            ## Skills Analysis
            - **Current Skills**: [List ALL skills the candidate demonstrates, categorized by type.]
            - **Skill Proficiency**: [Assess the apparent level of expertise in key skills.]
            - **Missing Skills**: [List important skills that would improve the resume for their target role.]

            ## Experience Analysis
            [Provide detailed feedback on how well the candidate has presented their experience.]

            ## Education Analysis
            [Analyze the education section.]

            ## Key Strengths
            [List 5-7 specific strengths of the resume with detailed explanations.]

            ## Areas for Improvement
            [List 5-7 specific areas where the resume could be improved with actionable recommendations.]

            ## ATS Optimization Assessment
            [Analyze how well the resume is optimized for ATS. Provide: "ATS Score: XX/100".]

            ## Recommended Courses/Certifications
            [Suggest 5-7 specific courses or certifications.]

            ## Resume Score
            [Provide a score from 0-100. Use this format exactly: "Resume Score: XX/100".]

            Resume:
            {resume_text}
            """

            if job_role:
                base_prompt += f"""

                The candidate is targeting a role as: {job_role}

                ## Role Alignment Analysis
                [Analyze how well the resume aligns with the target role of {job_role}.]
                """

            if job_description:
                base_prompt += f"""

                Additionally, compare this resume to the following job description:

                Job Description:
                {job_description}

                ## Job Match Analysis
                [Provide a detailed analysis of how well the resume matches the job description.]

                ## Key Job Requirements Not Met
                [List specific requirements from the job description that are not addressed in the resume.]
                """

            response = model.generate_content(base_prompt)
            analysis = response.text.strip()

            resume_score = self._extract_score_from_text(analysis)
            ats_score = self._extract_ats_score_from_text(analysis)

            return {
                "analysis": analysis,
                "resume_score": resume_score,
                "ats_score": ats_score,
            }

        except Exception as e:
            return {"error": f"Analysis failed: {str(e)}"}

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
