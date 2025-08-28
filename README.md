# AI Learning Platform 🚀

An AI-powered learning platform for cloud certifications (Azure AI Engineer, AWS Solutions Architect, etc.) with personalized learning paths, exercises, and progress tracking.

## Features ✨

- **AI-Powered Learning Path Generation**: Create custom learning paths based on your goals
- **Interactive Dashboard**: Track progress, earn badges, and monitor achievements
- **Hands-on Exercises**: Practice with real-world scenarios and cloud labs
- **Smart Quizzes**: Auto-evaluated assessments with detailed explanations
- **Beautiful UI**: Modern, responsive design with dark/light mode
- **Production-Ready**: Dockerized setup, structured codebase, clean architecture

## Tech Stack 🛠️

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- React Query
- React Router v6

### Backend
- Python FastAPI
- Azure OpenAI Integration
- Redis Caching
- PostgreSQL (optional)
- Docker

## Quick Start 🏃‍♂️

### Prerequisites
- Docker & Docker Compose
- Azure OpenAI API Key

### Setup

1. Clone the repository:
```bash
git clone <your-repo>
cd ai-learning-platform
```

2. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Add your Azure OpenAI credentials to backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure 📁

```
ai-learning-platform/
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/      # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   └── Dockerfile
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configurations
│   │   ├── models/       # Data models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints 🔌

- `POST /api/v1/learning-path/generate` - Generate AI learning path
- `GET /api/v1/learning-path/mock` - Get mock learning path
- `GET /api/v1/learning-path/{id}` - Get specific learning path
- `POST /api/v1/learning-path/{id}/progress` - Update progress
- `GET /api/v1/quiz/{id}` - Get quiz details
- `POST /api/v1/quiz/{id}/submit` - Submit quiz answers
- `GET /api/v1/exercise/{id}` - Get exercise details

## Development 💻

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Testing 🧪

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Deployment 🚢

The application is production-ready and can be deployed using:
- Docker Swarm
- Kubernetes
- AWS ECS/Fargate
- Azure Container Instances
- Google Cloud Run

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

MIT License

## Support 💬

For issues and questions, please open a GitHub issue.
EOF

echo "✅ All setup files have been created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Navigate to the ai-learning-platform directory"
echo "2. Copy the code from the artifacts into the respective files"
echo "3. Set up your Azure OpenAI API credentials in backend/.env"
echo "4. Run: docker-compose up --build"
echo "5. Access the app at http://localhost:3000"
echo ""
echo "🎉 Your AI Learning Platform is ready to launch!"