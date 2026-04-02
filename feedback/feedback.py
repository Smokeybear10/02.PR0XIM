import streamlit as st
import sqlite3
from datetime import datetime
import pandas as pd
import time

class FeedbackManager:
    def __init__(self):
        self.db_path = "feedback/feedback.db"
        self.setup_database()

    def setup_database(self):
        """Create feedback table if it doesn't exist"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('''
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
        ''')
        conn.commit()
        conn.close()

    def save_feedback(self, feedback_data):
        """Save feedback to database"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('''
            INSERT INTO feedback (
                rating, usability_score, feature_satisfaction,
                missing_features, improvement_suggestions,
                user_experience, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            feedback_data['rating'],
            feedback_data['usability_score'],
            feedback_data['feature_satisfaction'],
            feedback_data['missing_features'],
            feedback_data['improvement_suggestions'],
            feedback_data['user_experience'],
            datetime.now()
        ))
        conn.commit()
        conn.close()

    def get_feedback_stats(self):
        """Get feedback statistics"""
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query("SELECT * FROM feedback", conn)
        conn.close()
        
        if df.empty:
            return {
                'avg_rating': 0,
                'avg_usability': 0,
                'avg_satisfaction': 0,
                'total_responses': 0
            }
        
        return {
            'avg_rating': df['rating'].mean(),
            'avg_usability': df['usability_score'].mean(),
            'avg_satisfaction': df['feature_satisfaction'].mean(),
            'total_responses': len(df)
        }

    def render_feedback_form(self):
        """Render the feedback form"""
        st.markdown("""
            <style>
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
            
            .feedback-container {
                background: rgba(51, 255, 51, 0.03);
                padding: 30px;
                border-radius: 0px;
                margin: 20px 0;
                border: 1px solid rgba(51, 255, 51, 0.05);
            }
            
            .feedback-header {
                color: #33FF33;
                font-family: "JetBrains Mono", monospace;
                font-size: 1.5em;
                font-weight: 600;
                margin-bottom: 25px;
                text-align: center;
                padding: 15px;
                background: #0D1F0D;
                border-radius: 0px;
            }
            
            .feedback-section {
                margin: 20px 0;
                padding: 20px;
                border-radius: 0px;
                background: rgba(51, 255, 51, 0.02);
                border: 1px solid rgba(51, 255, 51, 0.05);
            }

            .feedback-section:hover {
            }
            
            .feedback-label {
                color: #33FF33;
                font-family: "JetBrains Mono", monospace;
                font-size: 1.1em;
                font-weight: 500;
                margin-bottom: 10px;
            }
            
            .star-rating {
                font-family: "JetBrains Mono", monospace;
                font-size: 24px;
                color: #33FF33;
                cursor: pointer;
            }

            .star-rating:hover {
            }
            
            .rating-container {
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 15px 0;
            }
            
            .submit-button {
                background: #33FF33;
                color: #0A0A0A;
                font-family: "JetBrains Mono", monospace;
                padding: 12px 25px;
                border: none;
                border-radius: 0px;
                font-weight: 600;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                width: 100%;
                margin-top: 20px;
            }

            .submit-button:hover {
            }
            
            .textarea-container {
                background: rgba(51, 255, 51, 0.02);
                border: 1px solid rgba(51, 255, 51, 0.05);
                border-radius: 0px;
                padding: 10px;
                margin-top: 10px;
            }

            .textarea-container textarea {
                width: 100%;
                min-height: 100px;
                background: transparent;
                border: none;
                color: #33FF33;
                font-family: "JetBrains Mono", monospace;
                font-size: 1em;
                resize: vertical;
            }
            </style>
            """, unsafe_allow_html=True)

        st.markdown('<div class="feedback-container">', unsafe_allow_html=True)
        st.markdown('<h2 class="feedback-header">> Share Your Feedback</h2>', unsafe_allow_html=True)

        # Overall Rating
        st.markdown('<div class="feedback-section">', unsafe_allow_html=True)
        st.markdown('<label class="feedback-label">Overall Experience Rating</label>', unsafe_allow_html=True)
        rating = st.slider("Overall Rating", 1, 5, 5, help="Rate your overall experience with the app", label_visibility="collapsed")
        st.markdown(f'<div class="rating-container">{"*" * rating}</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # Usability Score
        st.markdown('<div class="feedback-section">', unsafe_allow_html=True)
        st.markdown('<label class="feedback-label">How easy was it to use our app?</label>', unsafe_allow_html=True)
        usability_score = st.slider("Usability Score", 1, 5, 5, help="Rate the app's ease of use", label_visibility="collapsed")
        st.markdown(f'<div class="rating-container">{"*" * usability_score}</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # Feature Satisfaction
        st.markdown('<div class="feedback-section">', unsafe_allow_html=True)
        st.markdown('<label class="feedback-label">How satisfied are you with our features?</label>', unsafe_allow_html=True)
        feature_satisfaction = st.slider("Feature Satisfaction", 1, 5, 5, help="Rate your satisfaction with the app's features", label_visibility="collapsed")
        st.markdown(f'<div class="rating-container">{"*" * feature_satisfaction}</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # Text Feedback
        st.markdown('<div class="feedback-section">', unsafe_allow_html=True)
        st.markdown('<label class="feedback-label">What features would you like to see added?</label>', unsafe_allow_html=True)
        missing_features = st.text_area("Missing Features", placeholder="Share your feature requests...", label_visibility="collapsed")

        st.markdown('<label class="feedback-label">How can we improve?</label>', unsafe_allow_html=True)
        improvement_suggestions = st.text_area("Improvement Suggestions", placeholder="Your suggestions for improvement...", label_visibility="collapsed")

        st.markdown('<label class="feedback-label">Tell us about your experience</label>', unsafe_allow_html=True)
        user_experience = st.text_area("User Experience", placeholder="Share your experience with us...", label_visibility="collapsed")
        st.markdown('</div>', unsafe_allow_html=True)

        # Submit Button
        if st.button("Submit Feedback", key="submit_feedback"):
            try:
                # Create progress bar
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                # Simulate processing with animation
                for i in range(100):
                    progress_bar.progress(i + 1)
                    if i < 30:
                        status_text.text("Processing feedback...")
                    elif i < 60:
                        status_text.text("> Analyzing responses...")
                    elif i < 90:
                        status_text.text("> Saving to database...")
                    else:
                        status_text.text("> Finalizing...")
                    time.sleep(0.01)

                # Save feedback
                feedback_data = {
                    'rating': rating,
                    'usability_score': usability_score,
                    'feature_satisfaction': feature_satisfaction,
                    'missing_features': missing_features,
                    'improvement_suggestions': improvement_suggestions,
                    'user_experience': user_experience
                }
                self.save_feedback(feedback_data)
                
                # Clear progress elements
                progress_bar.empty()
                status_text.empty()
                
                # Show success message with animation
                success_container = st.empty()
                success_container.markdown("""
                    <div style="text-align: center; padding: 20px; background: rgba(51, 255, 51, 0.05); border-radius: 0px;">
                        <h2 style="color: #33FF33; font-family: 'JetBrains Mono', monospace;">Thank You!</h2>
                        <p style="color: #22AA22; font-family: 'JetBrains Mono', monospace;">Your feedback helps us improve Smart Resume AI</p>
                    </div>
                """, unsafe_allow_html=True)
                
                # Show balloons animation
                st.balloons()
                
                # Keep success message visible
                time.sleep(2)
                
            except Exception as e:
                st.error(f"Error submitting feedback: {str(e)}")

    def render_feedback_stats(self):
        """Render feedback statistics"""
        stats = self.get_feedback_stats()
        
        st.markdown("""
            <div style="text-align: center; padding: 15px; background: rgba(51, 255, 51, 0.05); border-radius: 0px; margin-bottom: 20px;">
                <h3 style="color: #33FF33; font-family: 'JetBrains Mono', monospace;">> Feedback Overview</h3>
            </div>
        """, unsafe_allow_html=True)
        
        cols = st.columns(4)
        metrics = [
            {"label": "Total Responses", "value": f"{stats['total_responses']:,}", "delta": "↗"},
            {"label": "Avg Rating", "value": f"{stats['avg_rating']:.1f}/5.0", "delta": "*"},
            {"label": "Usability Score", "value": f"{stats['avg_usability']:.1f}/5.0", "delta": ">"},
            {"label": "Satisfaction", "value": f"{stats['avg_satisfaction']:.1f}/5.0", "delta": ""}
        ]
        
        for col, metric in zip(cols, metrics):
            col.markdown(f"""
                <div style="background: rgba(51, 255, 51, 0.03); padding: 15px; border-radius: 0px; text-align: center;">
                    <div style="color: #22AA22; font-family: 'JetBrains Mono', monospace; font-size: 0.9em;">{metric['label']}</div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.5em; color: #33FF33; margin: 5px 0;">{metric['value']}</div>
                    <div style="color: #33FF33; font-family: 'JetBrains Mono', monospace; font-size: 1.2em;">{metric['delta']}</div>
                </div>
            """, unsafe_allow_html=True)
