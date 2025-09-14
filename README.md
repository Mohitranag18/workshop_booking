# Workshop Booking System

A full-stack workshop booking application with Django REST Framework backend and React frontend.

## Project Structure

```
workshop_booking/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions and API services
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Django backend application
│   ├── workshop_app/       # Main Django app
│   ├── workshop_portal/    # Django project settings
│   ├── statistics_app/     # Statistics functionality
│   ├── teams/              # Team management
│   ├── cms/                # Content management
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── db.sqlite3          # SQLite database
└── docs/                   # Documentation
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Workshop Management**: Propose, accept, and manage workshops
- **Profile Management**: User profiles with detailed information
- **Statistics**: Public and team statistics
- **Workshop Types**: Manage different types of workshops
- **Responsive Design**: Modern, mobile-friendly interface

## API Endpoints

- `http://localhost:8000/api/` - Main API endpoints
- `http://localhost:8000/api/token/` - JWT token authentication
- `http://localhost:8000/api/workshops/` - Workshop management
- `http://localhost:8000/api/workshop-types/` - Workshop type management
- `http://localhost:8000/api/profiles/` - User profile management

## Development

The application uses:
- **Backend**: Django 3.2+ with Django REST Framework
- **Frontend**: React 18+ with Vite
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (development) / PostgreSQL (production)
- **Styling**: Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.
