import streamlit as st

def apply_modern_styles():
    """Apply modern styles by loading the CSS file"""
    # Styles are now loaded from style.css in app.py
    pass

def page_header(title, subtitle=None):
    """Render a consistent page header with gradient background"""
    st.markdown(
        f'''
        <div class="page-header">
            <h1 class="header-title">{title}</h1>
            {f'<p class="header-subtitle">{subtitle}</p>' if subtitle else ''}
        </div>
        ''',
        unsafe_allow_html=True
    )

def hero_section(title, subtitle=None, description=None):
    """Render a modern hero section with gradient background and animations"""
    # If description is provided but subtitle is not, use description as subtitle
    if description and not subtitle:
        subtitle = description
        description = None
    
    st.markdown(
        f'''
        <div class="page-header hero-header">
            <h1 class="header-title">{title}</h1>
            {f'<div class="header-subtitle">{subtitle}</div>' if subtitle else ''}
            {f'<p class="header-description">{description}</p>' if description else ''}
        </div>
        ''',
        unsafe_allow_html=True
    )

def feature_card(icon, title, description):
    """Render a modern feature card with hover effects"""
    st.markdown(f"""
        <div class="card feature-card">
            <div class="feature-icon icon-pulse">
                <i class="{icon}"></i>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    """, unsafe_allow_html=True)

def about_section(content, image_path=None, social_links=None):
    """Render a modern about section with profile image and social links"""
    st.markdown("""
        <div class="glass-card about-section">
            <div class="profile-section">
    """, unsafe_allow_html=True)
    
    # Profile Image
    if image_path:
        st.image(image_path, use_column_width=False, width=200)
    
    # Image Upload
    uploaded_file = st.file_uploader("Upload profile picture", type=['png', 'jpg', 'jpeg'])
    if uploaded_file is not None:
        st.image(uploaded_file, use_column_width=False, width=200)
    
    # Social Links
    if social_links:
        st.markdown('<div class="social-links">', unsafe_allow_html=True)
        for platform, url in social_links.items():
            st.markdown(f'<a href="{url}" target="_blank" class="social-link"><i class="fab fa-{platform.lower()}"></i></a>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    # About Content
    st.markdown(f"""
            </div>
            <div class="about-content">{content}</div>
        </div>
    """, unsafe_allow_html=True)

def metric_card(label, value, delta=None, icon=None):
    """Render a modern metric card with animations"""
    icon_html = f'<i class="{icon}"></i>' if icon else ''
    delta_html = f'<div class="metric-delta">{delta}</div>' if delta else ''
    
    st.markdown(f"""
        <div class="metric-card">
            <div class="metric-header">
                {icon_html}
                <div class="metric-label">{label}</div>
            </div>
            <div class="metric-value">{value}</div>
            {delta_html}
        </div>
    """, unsafe_allow_html=True)

def template_card(title, description, image_url=None):
    """Render a modern template card with glassmorphism effect"""
    image_html = f'<img src="{image_url}" class="template-image" />' if image_url else ''
    
    st.markdown(f"""
        <div class="glass-card template-card">
            {image_html}
            <h3>{title}</h3>
            <p>{description}</p>
            <div class="card-overlay"></div>
        </div>
    """, unsafe_allow_html=True)

def feedback_card(name, feedback, rating):
    """Render a modern feedback card with rating stars"""
    stars = "*" * int(rating)
    
    st.markdown(f"""
        <div class="card feedback-card">
            <div class="feedback-header">
                <div class="feedback-name">{name}</div>
                <div class="feedback-rating">{stars}</div>
            </div>
            <p class="feedback-text">{feedback}</p>
        </div>
    """, unsafe_allow_html=True)

def loading_spinner(message="Loading..."):
    """Show a modern loading spinner with message"""
    st.markdown(f"""
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-message">{message}</p>
        </div>
    """, unsafe_allow_html=True)

def progress_bar(value, max_value, label=None):
    """Render a modern animated progress bar"""
    percentage = (value / max_value) * 100
    label_html = f'<div class="progress-label">{label}</div>' if label else ''
    
    st.markdown(f"""
        <div class="progress-container">
            {label_html}
            <div class="progress-bar">
                <div class="progress-fill" style="width: {percentage}%"></div>
            </div>
            <div class="progress-value">{percentage:.1f}%</div>
        </div>
    """, unsafe_allow_html=True)

def tooltip(content, tooltip_text):
    """Render content with a modern tooltip"""
    st.markdown(f"""
        <div class="tooltip" data-tooltip="{tooltip_text}">
            {content}
        </div>
    """, unsafe_allow_html=True)

def data_table(data, headers):
    """Render a modern data table with hover effects"""
    header_row = "".join([f"<th>{header}</th>" for header in headers])
    rows = ""
    for row in data:
        cells = "".join([f"<td>{cell}</td>" for cell in row])
        rows += f"<tr>{cells}</tr>"
    
    st.markdown(f"""
        <div class="table-container">
            <table class="modern-table">
                <thead>
                    <tr>{header_row}</tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    """, unsafe_allow_html=True)

def grid_layout(*elements):
    """Create a responsive grid layout"""
    st.markdown("""
        <div class="grid">
            {}
        </div>
    """.format("".join(elements)), unsafe_allow_html=True)

def alert(message, type="info"):
    """Display a modern alert message"""
    alert_types = {
        "info": ("[i]", "#33FF33"),
        "success": ("[ok]", "#22AA22"),
        "warning": ("[!]", "#33FF33"),
        "error": ("[x]", "#33FF33")
    }
    icon, color = alert_types.get(type, alert_types["info"])
    
    st.markdown(f"""
        <div class="alert alert-{type}">
            <span class="alert-icon">{icon}</span>
            <span class="alert-message">{message}</span>
        </div>
    """, unsafe_allow_html=True)

def about_section(title, description, team_members=None):
    st.markdown(f"""
        <div class="about-section">
            <h2>{title}</h2>
            <p class="about-description">{description}</p>
            {generate_team_section(team_members) if team_members else ''}
        </div>
        <style>
            .about-section {{
                background: #111111;
                border: 1px solid #1E3A1E;
                border-radius: 0px;
                padding: 32px 20px;
                margin: 16px 0;
            }}

            .about-section h2 {{
                color: #33FF33;
                margin-bottom: 16px;
                font-size: 22px;
                font-weight: 400;
                font-family: "JetBrains Mono", monospace;
            }}

            .about-description {{
                color: #22AA22;
                line-height: 1.6;
                font-size: 15px;
                max-width: 800px;
                margin-bottom: 16px;
                font-family: "JetBrains Mono", monospace;
            }}

            .team-section {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
                margin-top: 16px;
            }}

            .team-member {{
                background: #1A1A1A;
                border-radius: 0px;
                padding: 20px;
                text-align: center;
                border: 1px solid #1E3A1E;
                transition: border-color 120ms ease-out;
            }}

            .team-member:hover {{
                border-color: #33FF33;
            }}

            .team-member img {{
                width: 120px;
                height: 120px;
                border-radius: 50%;
                margin-bottom: 12px;
            }}

            .team-member h3 {{
                color: #33FF33;
                margin-bottom: 4px;
                font-family: "JetBrains Mono", monospace;
                font-size: 15px;
                font-weight: 500;
            }}

            .team-member p {{
                color: #22AA22;
                font-family: "JetBrains Mono", monospace;
                font-size: 13px;
            }}
        </style>
    """, unsafe_allow_html=True)

def generate_team_section(team_members):
    if not team_members:
        return ""
    
    team_html = '<div class="team-section">'
    for member in team_members:
        team_html += f"""
            <div class="team-member">
                <img src="{member['image']}" alt="{member['name']}">
                <h3>{member['name']}</h3>
                <p>{member['role']}</p>
            </div>
        """
    team_html += '</div>'
    return team_html

def render_feedback(feedback_data):
    """Render feedback with modern styling"""
    if not feedback_data:
        return
    
    feedback_html = """
    <div class="feedback-section">
        <h3 class="feedback-header">Resume Analysis Feedback</h3>
        <div class="feedback-content">
    """
    
    for category, items in feedback_data.items():
        if items:  # Only show categories with feedback
            for item in items:
                feedback_html += f"""
                <div class="feedback-item">
                    <div class="feedback-category">{category}</div>
                    <div class="feedback-description">{item}</div>
                </div>
                """
    
    feedback_html += """
        </div>
    </div>
    """
    
    st.markdown(feedback_html, unsafe_allow_html=True)

def render_analytics_section(resume_uploaded=False, metrics=None):
    """Render the analytics section of the dashboard"""
    if not metrics:
        metrics = {
            'views': 0,
            'downloads': 0,
            'score': 'N/A'
        }

    # Views Card
    st.markdown("""
        <div style='background: #111111; border: 1px solid #1E3A1E; border-radius: 0px; padding: 24px; text-align: center; margin-bottom: 12px;'>
            <div style='color: #116611; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-family: "JetBrains Mono", monospace;'>Resume Views</div>
            <p style='color: #33FF33; font-size: 48px; font-weight: 600; margin: 0; font-family: "JetBrains Mono", monospace; font-variant-numeric: tabular-nums;'>{}</p>
        </div>
    """.format(metrics['views']), unsafe_allow_html=True)

    # Downloads Card
    st.markdown("""
        <div style='background: #111111; border: 1px solid #1E3A1E; border-radius: 0px; padding: 24px; text-align: center; margin-bottom: 12px;'>
            <div style='color: #116611; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-family: "JetBrains Mono", monospace;'>Downloads</div>
            <p style='color: #33FF33; font-size: 48px; font-weight: 600; margin: 0; font-family: "JetBrains Mono", monospace; font-variant-numeric: tabular-nums;'>{}</p>
        </div>
    """.format(metrics['downloads']), unsafe_allow_html=True)

    # Profile Score Card
    st.markdown("""
        <div style='background: #111111; border: 1px solid #1E3A1E; border-radius: 0px; padding: 24px; text-align: center; margin-bottom: 12px;'>
            <div style='color: #116611; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-family: "JetBrains Mono", monospace;'>Profile Score</div>
            <p style='color: #33FF33; font-size: 48px; font-weight: 600; margin: 0; font-family: "JetBrains Mono", monospace; font-variant-numeric: tabular-nums;'>{}</p>
        </div>
    """.format(metrics['score']), unsafe_allow_html=True)

def render_activity_section(resume_uploaded=False):
    """Render the recent activity section"""
    st.markdown("""
        <div style='background: #111111; border: 1px solid #1E3A1E; border-radius: 0px; padding: 24px; height: 100%;'>
            <h2 style='color: #116611; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; font-family: "JetBrains Mono", monospace;'>Recent Activity</h2>
    """, unsafe_allow_html=True)

    if resume_uploaded:
        st.markdown("""
            <div style='color: #22AA22; font-family: "JetBrains Mono", monospace; font-size: 14px;'>
                <p style='margin: 8px 0;'>Resume uploaded and analyzed</p>
                <p style='margin: 8px 0;'>Generated optimization suggestions</p>
                <p style='margin: 8px 0;'>Updated profile score</p>
            </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown("""
            <div style='text-align: center; padding: 32px 20px; color: #116611; font-family: "JetBrains Mono", monospace;'>
                <p style='margin: 0; font-size: 14px;'>Upload your resume to see activity</p>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)

def render_suggestions_section(resume_uploaded=False):
    """Render the suggestions section"""
    st.markdown("""
        <div style='background: #111111; border: 1px solid #1E3A1E; border-radius: 0px; padding: 24px; height: 100%;'>
            <h2 style='color: #116611; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; font-family: "JetBrains Mono", monospace;'>Suggestions</h2>
    """, unsafe_allow_html=True)

    if resume_uploaded:
        st.markdown("""
            <div style='color: #33FF33; font-family: "JetBrains Mono", monospace; font-size: 14px;'>
                <p style='margin: 8px 0;'>Add more quantifiable achievements</p>
                <p style='margin: 8px 0;'>Include relevant keywords</p>
                <p style='margin: 8px 0;'>Optimize formatting</p>
            </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown("""
            <div style='text-align: center; padding: 32px 20px; color: #116611; font-family: "JetBrains Mono", monospace;'>
                <p style='margin: 0; font-size: 14px;'>Upload your resume to get suggestions</p>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)