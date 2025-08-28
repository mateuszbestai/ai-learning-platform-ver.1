# backend/app/utils/ai_prompts.py

LEARNING_PATH_SYSTEM_PROMPT = """
You are an expert educational AI that creates personalized learning paths for cloud certifications.
Your learning paths should be:
1. Structured and progressive
2. Include hands-on exercises
3. Have clear milestones
4. Include time estimates
5. Provide resource recommendations
6. Include assessments and quizzes

Return your response as a JSON object with a clear structure including:
- title: string
- description: string
- total_duration_hours: number
- nodes: array of learning modules with exercises and quizzes
- metadata: additional information

Each node should have:
- id: unique identifier
- title: module title
- description: module description
- order: sequence number
- duration_hours: estimated time
- type: module/project/assessment
- topics: list of topics covered
- resources: learning materials
- exercises: hands-on activities
- quiz: assessment questions
"""

QUIZ_GENERATION_PROMPT = """
Generate {num_questions} quiz questions about {topic} at {difficulty} difficulty level.
Include multiple choice, true/false, and multiple select questions.
Each question should have:
- Clear question text
- Multiple options (for multiple choice)
- Correct answer(s)
- Explanation
- Point value

Return as JSON with structure:
{{
  "title": "Quiz title",
  "description": "Quiz description",
  "questions": [
    {{
      "id": "q1",
      "question": "Question text",
      "type": "multiple_choice|multiple_select|true_false",
      "options": ["Option 1", "Option 2", ...],
      "correct_answer": 0,  // for single choice
      "correct_answers": [0, 1],  // for multiple select
      "explanation": "Why this is correct",
      "points": 10
    }}
  ],
  "passing_score": 70,
  "time_limit_minutes": 30
}}
"""

EXERCISE_GENERATION_PROMPT = """
Create a {exercise_type} exercise for {topic} at {difficulty} difficulty level.
Include:
- Clear objectives
- Step-by-step instructions
- Starter code or templates if applicable
- Test cases or validation criteria
- Hints or tips
- Estimated completion time

Return as structured JSON:
{{
  "title": "Exercise title",
  "description": "Exercise description",
  "type": "{exercise_type}",
  "difficulty": "{difficulty}",
  "instructions": ["Step 1", "Step 2", ...],
  "starter_code": "// Code template",
  "test_cases": [
    {{"input": "test input", "expected_output": "expected result"}}
  ],
  "hints": ["Hint 1", "Hint 2"],
  "estimated_time_minutes": 45,
  "points": 100
}}
"""

# Additional prompts for different scenarios
CONCEPT_EXPLANATION_PROMPT = """
Explain the concept of {concept} in the context of {certification}.
Provide:
1. Clear definition
2. Real-world examples
3. Common use cases
4. Best practices
5. Common pitfalls to avoid
"""

PROJECT_GENERATION_PROMPT = """
Design a hands-on project for {topic} that demonstrates practical skills.
The project should:
1. Have clear objectives
2. Be completable in {duration} hours
3. Cover multiple concepts
4. Include deployment steps
5. Have evaluation criteria
"""

LEARNING_STYLE_PROMPTS = {
    "visual": "Include diagrams, charts, and visual representations where applicable.",
    "hands-on": "Focus on practical exercises and real-world applications.",
    "theoretical": "Provide in-depth explanations and conceptual understanding.",
    "project-based": "Structure learning around building complete projects."
}

CERTIFICATION_TEMPLATES = {
    "azure-ai-engineer": {
        "title": "Azure AI Engineer Associate",
        "focus_areas": [
            "Azure Cognitive Services",
            "Machine Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Conversational AI"
        ],
        "duration_hours": 120
    },
    "azure-solutions-architect": {
        "title": "Azure Solutions Architect Expert",
        "focus_areas": [
            "Infrastructure",
            "Security",
            "Networking",
            "Storage",
            "Compute",
            "Monitoring"
        ],
        "duration_hours": 150
    },
    "aws-solutions-architect": {
        "title": "AWS Solutions Architect Associate",
        "focus_areas": [
            "EC2",
            "S3",
            "VPC",
            "IAM",
            "RDS",
            "Lambda"
        ],
        "duration_hours": 130
    },
    "aws-developer": {
        "title": "AWS Certified Developer Associate",
        "focus_areas": [
            "Lambda",
            "API Gateway",
            "DynamoDB",
            "SQS/SNS",
            "CloudFormation",
            "CI/CD"
        ],
        "duration_hours": 100
    },
    "gcp-cloud-engineer": {
        "title": "Google Cloud Professional Cloud Engineer",
        "focus_areas": [
            "Compute Engine",
            "App Engine",
            "Kubernetes Engine",
            "Cloud Storage",
            "BigQuery",
            "Cloud Functions"
        ],
        "duration_hours": 140
    }
}

def get_system_prompt_for_certification(certification: str) -> str:
    """Get a specialized system prompt for a specific certification"""
    template = CERTIFICATION_TEMPLATES.get(certification.lower().replace(" ", "-"))
    
    if template:
        focus_areas = ", ".join(template["focus_areas"])
        return f"""
        {LEARNING_PATH_SYSTEM_PROMPT}
        
        For {template['title']} certification, focus on:
        {focus_areas}
        
        Estimated total duration: {template['duration_hours']} hours
        """
    
    return LEARNING_PATH_SYSTEM_PROMPT

def enhance_prompt_with_preferences(base_prompt: str, preferences: dict) -> str:
    """Enhance prompt based on user preferences"""
    enhanced = base_prompt
    
    if preferences.get("learning_style"):
        style_hint = LEARNING_STYLE_PROMPTS.get(preferences["learning_style"], "")
        enhanced += f"\n\n{style_hint}"
    
    if preferences.get("include_labs"):
        enhanced += "\n\nInclude hands-on lab exercises with cloud sandbox environments."
    
    if preferences.get("include_quizzes"):
        enhanced += "\n\nInclude comprehensive quizzes after each module."
    
    if preferences.get("include_projects"):
        enhanced += "\n\nInclude real-world projects to demonstrate skills."
    
    return enhanced