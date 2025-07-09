# 🎯 TalentLens

**Professional AI-Powered Interview Training Platform**

A comprehensive, market-ready interview training system that leverages AI to provide personalized interview experiences, real-time feedback, and detailed analytics for students, teachers, and administrators.

## 🌟 Features

### 🎓 For Students

- **AI-Generated Interviews**: Personalized technical, communication, and aptitude questions based on resume analysis
- **Real-time Feedback**: Instant scoring and detailed feedback using Google Gemini AI
- **Secure Interview Environment**: Anti-cheating measures with tab switching detection and fullscreen mode
- **Progress Tracking**: Comprehensive analytics and performance trends
- **Resume Management**: Upload and AI analysis of resumes with improvement suggestions

### 👨‍🏫 For Teachers

- **Student Management**: Assign and monitor multiple students
- **Interview Scheduling**: Create and manage interview sessions
- **Analytics Dashboard**: Track student progress and performance
- **Resume Review**: Access student resumes and AI analysis

### 🔧 For Administrators

- **System Overview**: Comprehensive analytics and metrics
- **User Management**: Manage teachers, students, and assignments
- **Performance Analytics**: System-wide statistics and trends

## 🏗️ Architecture

### Backend (Django REST API)

- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL with optimized queries
- **AI Integration**: Google Gemini API for question generation and scoring
- **Authentication**: JWT-based with role-based access control
- **Background Tasks**: Celery with Redis

### Frontend (Multi-Client Architecture)

- **Framework**: Next.js 14 with TypeScript
- **Architecture**: Separate clients for Student, Teacher, and Admin portals
- **Styling**: Tailwind CSS with custom themes per client
- **State Management**: React Context with custom hooks

### Infrastructure

- **Containerization**: Docker and Docker Compose
- **Database**: PostgreSQL 13 with connection pooling
- **Cache/Queue**: Redis for caching and task queue

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

### 2. Run Setup Script

```bash
./setup.sh
```

### 3. Access the Applications

- **Student Portal**: http://localhost:3001 (Blue theme)
- **Teacher Portal**: http://localhost:3002 (Green theme)
- **Admin Dashboard**: http://localhost:3003 (Purple theme)
- **Backend API**: http://localhost:8000/api

### 4. Configure Gemini AI

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

3. Restart: `docker-compose restart backend`

## 📁 Project Structure

```
TalentLens/
├── backend/                 # Django REST API
│   ├── apps/               # Django applications
│   ├── talentlens/         # Django settings
│   └── requirements.txt    # Python dependencies
├── clients/                # Next.js applications
│   ├── shared/             # Shared components & utilities
│   ├── student-ui/         # Student portal (Blue theme)
│   ├── teacher-ui/         # Teacher portal (Green theme)
│   └── admin-ui/           # Admin dashboard (Purple theme)
├── docs/                   # Documentation
│   ├── README.md           # Documentation index
│   ├── ARCHITECTURE.md     # System architecture
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── development/        # Development docs
├── scripts/                # Setup and utility scripts
└── docker-compose.yml      # Development environment
```

## 🔧 Development

### Backend Development

```bash
# Enter backend container
docker-compose exec backend bash

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test
```

### Frontend Development

```bash
# Install dependencies for all clients
cd clients && npm install

# Start individual clients
npm run dev:student   # Student portal on :3001
npm run dev:teacher   # Teacher portal on :3002
npm run dev:admin     # Admin dashboard on :3003
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

- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Teacher, Student)
- Fullscreen mode enforcement during interviews
- Tab switching detection and warnings
- Input sanitization and SQL injection prevention

## 🧪 Testing

### Backend Tests

```bash
docker-compose exec backend python manage.py test
```

### Frontend Tests

```bash
cd clients && npm test
```

## 🚀 Deployment

### Production Environment

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/dbname
GEMINI_API_KEY=your_gemini_api_key
```

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🆘 Support

### Common Issues

**Backend not starting:**

- Check PostgreSQL: `docker-compose ps postgres`
- Verify environment variables in `backend/.env`
- Check logs: `docker-compose logs backend`

**Frontend build errors:**

- Clear node modules: `rm -rf clients/*/node_modules && cd clients && npm install`
- Check Node.js version (requires 18+)

### Getting Help

- Check comprehensive documentation in [`/docs`](./docs/) folder
- Browse: [Architecture](./docs/ARCHITECTURE.md), [Deployment](./docs/DEPLOYMENT.md), [Development](./docs/development/)
- Create GitHub issues for bugs or questions

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ Core interview system
- ✅ AI integration with Gemini
- ✅ User management and authentication
- ✅ Multi-client UI architecture

### Phase 2 (Planned)

- 🔄 Advanced analytics and insights
- 🔄 Video interview integration
- 🔄 Mobile app development

### Phase 3 (Future)

- 📋 Multi-language support
- 📋 Enterprise features and SSO
- 📋 Integration with job boards

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for better interview preparation**

_TalentLens - Empowering students, teachers, and organizations with AI-powered interview training._
