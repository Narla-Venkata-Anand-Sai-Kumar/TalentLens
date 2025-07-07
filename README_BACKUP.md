# 🎯 TalentLens

**Professional AI-Powered Interview Training Platform**

A comprehensive, market-ready interview training system that leverages AI to provide personalized interview experienc# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d talentlens_dev

# Backup database
docker-compose exec postgres pg_dump -U postgres talentlens_dev > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres talentlens_dev < backup.sql-time feedback, and detailed analytics for students, teachers, and administrators.

## 🌟 Features

### 🎓 For Students

- **AI-Generated Interviews**: Personalized technical, communication, and aptitude questions based on resume analysis
- **Real-time Feedback**: Instant scoring and detailed feedback using Google Gemini AI
- **Secure Interview Environment**: Anti-cheating measures with tab switching detection and fullscreen mode
- **Progress Tracking**: Comprehensive analytics and performance trends
- **Resume Management**: Upload and AI analysis of resumes with improvement suggestions
- **Achievement System**: Gamified learning with badges and streaks

### 👨‍🏫 For Teachers

- **Student Management**: Assign and monitor multiple students
- **Interview Scheduling**: Create and manage interview sessions
- **Analytics Dashboard**: Track student progress and performance
- **Resume Review**: Access student resumes and AI analysis
- **Feedback Management**: Review and enhance AI-generated feedback

### 🔧 For Administrators

- **System Overview**: Comprehensive analytics and metrics
- **User Management**: Manage teachers, students, and assignments
- **Performance Analytics**: System-wide statistics and trends
- **Content Management**: Manage interview templates and settings
- **System Alerts**: Monitor system health and user activity

## 🏗️ Architecture

### Backend (Django REST API)

- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL with optimized queries
- **AI Integration**: Google Gemini API for question generation and scoring
- **Real-time**: WebSockets with Django Channels
- **Authentication**: JWT-based with role-based access control
- **File Processing**: Resume parsing (PDF, DOC, DOCX)
- **Background Tasks**: Celery with Redis
- **Security**: HTTPS, CORS, input validation, SQL injection protection

### Frontend (Next.js Multi-Client Architecture)

- **Framework**: Next.js 14 with TypeScript
- **Architecture**: Separate clients for Student, Teacher, and Admin portals
- **Styling**: Tailwind CSS with custom themes per client
- **State Management**: React Context with custom hooks
- **Real-time**: Socket.IO client for notifications
- **Forms**: React Hook Form with Yup validation
- **Charts**: Recharts for analytics visualization
- **UI Components**: Headless UI for accessibility

### Infrastructure

- **Containerization**: Docker and Docker Compose
- **Database**: PostgreSQL 13 with connection pooling
- **Cache/Queue**: Redis for caching and task queue
- **File Storage**: Local storage with cloud storage ready
- **Monitoring**: Health checks and logging

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TalentLens
```

### 2. Clean Up (If migrating from old structure)

If you have an old `frontend/` folder, you can safely remove it:

```bash
# Remove old frontend folder (if exists)
rm -rf frontend/
```

The project now uses the multi-client architecture in the `clients/` folder.

### 3. Run Setup Script

```bash
./setup.sh
```

This script will:

- Set up environment variables
- Start PostgreSQL and Redis
- Run database migrations
- Install dependencies
- Start all services

### 4. Access the Applications

- **Student Portal**: http://localhost:3001 (Blue theme)
- **Teacher Portal**: http://localhost:3002 (Green theme)
- **Admin Dashboard**: http://localhost:3003 (Purple theme)
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

### 5. Configure Gemini AI

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

3. Restart the backend: `docker-compose restart backend`

## 📁 Project Structure

```
TalentLens/
├── backend/                 # Django REST API
│   ├── apps/
│   │   ├── authentication/ # Auth endpoints
│   │   ├── users/          # User management
│   │   ├── interviews/     # Interview system
│   │   ├── resumes/        # Resume management
│   │   ├── dashboard/      # Analytics
│   │   ├── notifications/  # Real-time notifications
│   │   └── ai_engine/      # AI integration
│   ├── talentlens/         # Django settings
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── clients/                # Next.js applications
│   ├── shared/             # Shared components & utilities
│   │   ├── api/           # API service layer
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Utility functions
│   ├── student-ui/        # Student portal (Blue theme)
│   ├── teacher-ui/        # Teacher portal (Green theme)
│   └── admin-ui/          # Admin dashboard (Purple theme)
├── docs/                  # Documentation
│   ├── README.md          # Documentation index
│   ├── ARCHITECTURE.md    # System architecture
│   ├── DEPLOYMENT.md      # Deployment guide
│   ├── PROJECT_PLAN.md    # Project planning
│   ├── development/       # Development docs
│   ├── features/          # Feature documentation
│   ├── fixes/             # Bug fixes & patches
│   └── testing/           # Testing documentation
├── scripts/               # Setup and utility scripts
├── docker-compose.yml     # Development environment
├── setup.sh              # Automated setup script
└── README.md
```

## 🔧 Development

### Backend Development

```bash
# Enter backend container
docker-compose exec backend bash

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### Frontend Development

```bash
# Install dependencies for all clients
cd clients && npm install

# Start all development servers
npm run dev:all

# Start individual clients
npm run dev:student   # Student portal on :3001
npm run dev:teacher   # Teacher portal on :3002
npm run dev:admin     # Admin dashboard on :3003

# Build for production
npm run build

# Run linting
npm run lint
```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d talentlens_dev

# Backup database
docker-compose exec postgres pg_dump -U postgres talentlens_dev > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres talentlens_dev < backup.sql
```

## 🔐 Security Features

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing with Django's built-in system
- API rate limiting and request validation

### Interview Security

- Fullscreen mode enforcement
- Tab switching detection and warnings
- Session timeouts and auto-submission
- Secure question generation and answer validation

### Data Protection

- Input sanitization and SQL injection prevention
- CORS configuration for cross-origin requests
- HTTPS enforcement in production
- Sensitive data encryption

## 📊 API Documentation

### Authentication Endpoints

```
POST /api/auth/login/           # User login
POST /api/auth/register/        # User registration
POST /api/auth/logout/          # User logout
GET  /api/auth/profile/         # Get user profile
PUT  /api/auth/profile/update/  # Update profile
```

### Interview Endpoints

```
GET    /api/interviews/              # List interviews
POST   /api/interviews/              # Create interview
GET    /api/interviews/{id}/         # Get interview details
POST   /api/interviews/{id}/start_interview/  # Start interview
POST   /api/interviews/{id}/submit_answer/    # Submit answer
POST   /api/interviews/{id}/complete_interview/ # Complete interview
GET    /api/interviews/{id}/get_results/      # Get results
```

### Resume Endpoints

```
GET    /api/resumes/              # List resumes
POST   /api/resumes/upload_resume/ # Upload resume
GET    /api/resumes/{id}/         # Get resume details
POST   /api/resumes/{id}/analyze_resume/ # Re-analyze resume
```

### Dashboard Endpoints

```
GET /api/dashboard/overview/        # Dashboard overview
GET /api/dashboard/metrics/         # Historical metrics
GET /api/dashboard/student_progress/ # Student progress
GET /api/dashboard/analytics/       # Detailed analytics
```

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
docker-compose exec backend python manage.py test

# Run specific app tests
docker-compose exec backend python manage.py test apps.interviews

# Run with coverage
docker-compose exec backend coverage run manage.py test
docker-compose exec backend coverage report
```

### Frontend Tests

```bash
# Run unit tests for all clients
cd clients && npm test

# Run tests for specific client
cd clients/student-ui && npm test
cd clients/teacher-ui && npm test
cd clients/admin-ui && npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Environment Variables

Create a `.env.production` file:

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/dbname
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://redis-host:6379/0
```

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Run migrations in production
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

### Performance Optimization

- Database query optimization with select_related and prefetch_related
- Redis caching for frequently accessed data
- Static file compression and CDN integration
- Image optimization and lazy loading
- Database connection pooling

## 📈 Monitoring & Analytics

### Built-in Analytics

- User engagement metrics
- Interview completion rates
- Performance trends and insights
- System health monitoring
- Error tracking and logging

### Metrics Tracked

- Total users, students, and teachers
- Interview statistics and scores
- Resume upload and analysis metrics
- Response times and system performance
- User activity and engagement patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- Follow PEP 8 for Python code
- Use TypeScript for all new frontend code
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Backend not starting:**

- Check PostgreSQL is running: `docker-compose ps postgres`
- Verify environment variables in `backend/.env`
- Check logs: `docker-compose logs backend`

**Frontend build errors:**

- Clear node modules: `rm -rf clients/*/node_modules && cd clients && npm install`
- Check Node.js version (requires 18+)
- Verify API URL in environment variables
- Ensure all client ports are available (3001, 3002, 3003)

**Database connection errors:**

- Ensure PostgreSQL is healthy: `docker-compose exec postgres pg_isready`
- Check database credentials in `.env`
- Wait for database to fully initialize

### Getting Help

- Check the comprehensive documentation in [`/docs`](./docs/) folder
- Browse organized docs: [Architecture](./docs/ARCHITECTURE.md), [Deployment](./docs/DEPLOYMENT.md), [Development](./docs/development/)
- Review GitHub issues for similar problems
- Create a new issue with detailed error logs
- Join our community discussions

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ Core interview system
- ✅ AI integration with Gemini
- ✅ User management and authentication
- ✅ Basic analytics and reporting

### Phase 2

- 🔄 Advanced analytics and insights
- 🔄 Mobile app development
- 🔄 Video interview integration
- 🔄 Advanced anti-cheating measures

### Phase 3

- 📋 Multi-language support
- 📋 Enterprise features and SSO
- 📋 Advanced AI coaching
- 📋 Integration with job boards

---

**Built with ❤️ for better interview preparation**

_TalentLens - Empowering students, teachers, and organizations with AI-powered interview training._
