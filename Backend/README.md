# Teacher Monitoring System - Backend

A Node.js/Express backend for the Teacher Monitoring System with QR code functionality.

## Features

- Teacher authentication and profile management
- QR code generation for teachers
- Student access to teacher information
- Analytics and scan tracking
- RESTful API endpoints

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication
- QR Code Generation
- bcrypt for password hashing

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database Setup**
   - Create a Supabase project
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Update the environment variables with your Supabase credentials

4. **Run the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Teacher registration
- `POST /api/auth/login` - Teacher login
- `GET /api/auth/profile` - Get current teacher profile
- `PUT /api/auth/profile` - Update teacher profile

### QR Code Management
- `POST /api/qr/generate` - Generate QR code for teacher
- `GET /api/qr/my-qr` - Get current teacher's QR code
- `POST /api/qr/scan` - Scan QR code (for students)
- `GET /api/qr/teacher/:teacherId` - Get teacher QR code

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `GET /api/teachers/analytics/me` - Get teacher analytics
- `GET /api/teachers/search/:query` - Search teachers
- `GET /api/teachers/department/:department` - Get teachers by department
- `GET /api/teachers/departments/list` - Get all departments

### Students
- `GET /api/students/teachers` - Get all teachers for student view
- `GET /api/students/teacher/:id` - Get teacher details
- `GET /api/students/search/:query` - Search teachers
- `GET /api/students/department/:department` - Get teachers by department
- `GET /api/students/departments` - Get all departments
- `GET /api/students/teacher/:id/qr` - Get teacher QR code
- `GET /api/students/recent-scans` - Get recently scanned teachers

## Database Schema

### Teachers Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `subject` (VARCHAR)
- `department` (VARCHAR)
- `phone` (VARCHAR, Optional)
- `office` (VARCHAR, Optional)
- `qr_code` (VARCHAR, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### QR Scans Table
- `id` (UUID, Primary Key)
- `teacher_id` (UUID, Foreign Key)
- `scanned_at` (TIMESTAMP)
- `ip_address` (INET, Optional)
- `user_agent` (TEXT, Optional)
- `created_at` (TIMESTAMP)

## File Structure

```
Backend/
├── config/
│   └── supabase.js
├── database/
│   └── schema.sql
├── routes/
│   ├── auth.js
│   ├── teachers.js
│   ├── students.js
│   └── qr.js
├── utils/
│   └── auth.js
├── uploads/          # QR code images
├── package.json
├── server.js
└── README.md
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Error handling middleware
- Row Level Security (RLS) in Supabase

## Development

The server runs on port 5000 by default. Make sure to update the frontend URL in your environment variables if needed. 