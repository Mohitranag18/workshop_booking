# Workshop Booking Backend

Django REST Framework backend for the Workshop Booking System.

## Quick Start

1. **Activate virtual environment:**
   ```bash
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver 8000
   ```

## API Endpoints

- **Authentication**: `/api/token/`
- **Workshops**: `/api/workshops/`
- **Workshop Types**: `/api/workshop-types/`
- **Profiles**: `/api/profiles/`
- **Statistics**: `/api/public-workshop-stats/`

## Project Structure

```
backend/
├── workshop_app/          # Main Django app
│   ├── api/              # API views and serializers
│   ├── models.py         # Database models
│   ├── views.py          # Django views
│   └── urls.py           # URL routing
├── workshop_portal/       # Django project settings
│   ├── settings.py       # Main settings
│   └── urls.py           # Root URL configuration
├── statistics_app/        # Statistics functionality
├── teams/                 # Team management
├── cms/                   # Content management
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
└── db.sqlite3            # SQLite database
```

## Development

- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens
- **CORS**: Configured for React frontend
- **API**: RESTful API with Django REST Framework

## Testing

```bash
python manage.py test
```

## Production Deployment

1. Set `DEBUG = False` in settings
2. Configure production database
3. Set up static file serving
4. Configure email settings
5. Set up proper CORS origins
