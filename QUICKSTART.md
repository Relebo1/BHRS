# Quick Start Guide - BHRS

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE bhrs_db;
exit;
```

### 3. Configure Environment
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
DATABASE_URL="mysql://root:yourpassword@localhost:3306/bhrs_db"
JWT_SECRET="your-secret-key-change-this"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Prisma
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with sample data
npm run prisma:seed
```

### 5. Run Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After seeding:

**Admin:**
- Email: `admin@botho.ac.bw`
- Password: `admin123`

**Doctor:**
- Email: `doctor@botho.ac.bw`
- Password: `doctor123`

**Nurse:**
- Email: `nurse@botho.ac.bw`
- Password: `nurse123`

## Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run prisma:studio       # Open database GUI

# Database
npm run prisma:generate     # Generate Prisma Client
npm run prisma:push         # Push schema changes
npm run prisma:seed         # Seed database

# Production
npm run build              # Build for production
npm run start              # Start production server

# Utilities
npm run hash-password      # Hash a password
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API endpoints
│   ├── dashboard/        # Dashboard page
│   ├── patients/         # Patient management
│   ├── medical-records/  # Medical records
│   ├── appointments/     # Appointments
│   ├── admin/           # Admin panel
│   └── login/           # Login page
├── components/          # React components
└── lib/                # Utilities
```

## Testing the System

### 1. Login
- Go to http://localhost:3000
- Login with admin credentials

### 2. Add Patient
- Navigate to Patients
- Click "Add New Patient"
- Fill form and submit

### 3. Add Medical Record
- Go to patient detail page
- Click "Add Record"
- Fill medical information

### 4. Create Appointment
- Navigate to Appointments
- Click "Create Appointment"
- Select patient and date

### 5. Manage Users (Admin only)
- Navigate to Users
- Click "Add User"
- Create new staff member

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify DATABASE_URL in .env
```

### Prisma Client Error
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Change default passwords
2. Customize branding
3. Add more features
4. Deploy to production

## Support

For help, check:
- README.md - Full documentation
- DEPLOYMENT.md - Deployment guide
- GitHub Issues - Report bugs
