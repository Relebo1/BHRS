# Botho Health Records System (BHRS)

A full-stack Electronic Medical Records (EMR) system for Botho University Clinic built with Next.js 14, TypeScript, Prisma, and MySQL.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Patient Management**: Register, view, edit, and search patients
- **Medical Records**: Add and view patient medical history
- **Appointments**: Create, reschedule, and manage appointments
- **User Management**: Admin can create clinic staff and assign roles
- **Dashboard**: Overview with statistics and recent activities
- **Reporting**: Patient visits and appointment statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT with bcryptjs

## Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd "Botho Health Records System (BHRS)"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE bhrs_db;
```

### 4. Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/bhrs_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Generate Prisma Client and Push Schema

```bash
npm run prisma:generate
npm run prisma:push
```

### 6. Seed Database (Optional)

Create a default admin user manually in MySQL:

```sql
USE bhrs_db;

INSERT INTO users (name, email, password, role, createdAt, updatedAt) 
VALUES (
  'Admin User', 
  'admin@botho.ac.bw', 
  '$2a$10$rZ5qK8qK5qK5qK5qK5qK5uK5qK5qK5qK5qK5qK5qK5qK5qK5qK5qK', 
  'admin', 
  NOW(), 
  NOW()
);
```

Or use this script to hash a password:

```javascript
// scripts/hash-password.js
const bcrypt = require('bcryptjs');
const password = 'admin123';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

Run: `node scripts/hash-password.js`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Credentials

```
Email: admin@botho.ac.bw
Password: admin123
```

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── patients/      # Patient endpoints
│   │   │   ├── medical-records/
│   │   │   ├── appointments/
│   │   │   └── users/
│   │   ├── dashboard/         # Dashboard page
│   │   ├── patients/          # Patient pages
│   │   ├── medical-records/   # Medical records pages
│   │   ├── appointments/      # Appointments pages
│   │   ├── admin/             # Admin pages
│   │   ├── login/             # Login page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── Navbar.tsx         # Navigation component
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   └── auth.ts            # Auth utilities
│   └── middleware.ts          # Route protection
├── .env                       # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/[id]` - Get patient by ID
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient (admin only)

### Medical Records
- `GET /api/medical-records` - Get all records
- `POST /api/medical-records` - Create record
- `GET /api/medical-records/[id]` - Get record by ID
- `PUT /api/medical-records/[id]` - Update record
- `DELETE /api/medical-records/[id]` - Delete record (admin only)

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/[id]` - Get appointment by ID
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Delete appointment

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user

## User Roles

- **Admin**: Full access including user management
- **Doctor**: Can manage patients, medical records, and appointments
- **Nurse**: Can manage patients and appointments

## Database Schema

### Users
- id, name, email, password, role, createdAt, updatedAt

### Patients
- id, studentId, firstName, lastName, gender, dateOfBirth, phone, address, createdAt, updatedAt

### Medical Records
- id, patientId, diagnosis, treatment, prescription, visitDate, doctorId, createdAt, updatedAt

### Appointments
- id, patientId, appointmentDate, status, notes, createdAt, updatedAt

## Deployment

### Vercel Deployment

1. Push code to GitHub

2. Import project to Vercel

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

4. Deploy

### Database Hosting

Use one of these MySQL hosting services:
- **PlanetScale** (recommended)
- **AWS RDS**
- **Railway**
- **DigitalOcean**

Update `DATABASE_URL` with production database connection string.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio
```

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- HTTP-only cookies
- Role-based access control
- Protected API routes
- SQL injection prevention (Prisma)

## Future Enhancements

- Patient search functionality
- Advanced reporting and analytics
- Email notifications
- File upload for medical documents
- Prescription printing
- Appointment reminders
- Audit logs

## License

MIT

## Support

For issues and questions, contact: support@botho.ac.bw
