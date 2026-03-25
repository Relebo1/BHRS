# Deployment Guide - BHRS

## Vercel + PlanetScale Deployment

### Step 1: Prepare Database (PlanetScale)

1. Create account at [planetscale.com](https://planetscale.com)

2. Create new database: `bhrs-production`

3. Get connection string:
   - Go to database settings
   - Click "Connect"
   - Select "Prisma"
   - Copy the connection string

4. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"  // Add this for PlanetScale
}
```

5. Add indexes for foreign keys:
```prisma
model MedicalRecord {
  // ... existing fields
  @@index([patientId])
  @@index([doctorId])
}

model Appointment {
  // ... existing fields
  @@index([patientId])
}
```

### Step 2: Deploy to Vercel

1. Push code to GitHub

2. Go to [vercel.com](https://vercel.com) and import project

3. Configure environment variables:
```
DATABASE_URL=<your-planetscale-connection-string>
JWT_SECRET=<generate-random-secret>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. Deploy

5. Run migrations:
```bash
npx prisma db push
```

6. Seed database:
```bash
npm run prisma:seed
```

### Step 3: Alternative - Railway Deployment

1. Create account at [railway.app](https://railway.app)

2. Create new project

3. Add MySQL database

4. Add Next.js service from GitHub

5. Set environment variables

6. Deploy

## Environment Variables

Production environment variables:

```env
DATABASE_URL="mysql://user:pass@host:3306/database?sslaccept=strict"
JWT_SECRET="use-strong-random-secret-min-32-chars"
NEXT_PUBLIC_APP_URL="https://your-production-url.com"
NODE_ENV="production"
```

## Post-Deployment

1. Test login with default credentials

2. Create production admin user

3. Delete or change default credentials

4. Test all features

5. Monitor logs for errors

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable SSL for database connection
- [ ] Set secure cookie flags in production
- [ ] Enable CORS only for your domain
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Monitor error logs

## Backup Strategy

### Database Backup (PlanetScale)
- Automatic daily backups included
- Manual backup: Export from dashboard

### Database Backup (Railway)
```bash
mysqldump -h host -u user -p database > backup.sql
```

### Restore
```bash
mysql -h host -u user -p database < backup.sql
```

## Monitoring

- Vercel Analytics: Built-in
- Error tracking: Add Sentry
- Uptime monitoring: Add UptimeRobot

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check connection string format
- Verify SSL settings
- Check firewall rules
- Verify database is running

### Authentication Issues
- Verify JWT_SECRET is set
- Check cookie settings
- Verify HTTPS in production

## Performance Optimization

1. Enable caching:
```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

2. Optimize images:
```typescript
import Image from 'next/image'
```

3. Add database indexes

4. Enable compression

## Scaling

- Vercel: Auto-scales
- Database: Upgrade plan as needed
- Consider Redis for sessions
- Add CDN for static assets

## Cost Estimation

### Free Tier (Development)
- Vercel: Free
- PlanetScale: Free (1 database)
- Total: $0/month

### Production (Small)
- Vercel Pro: $20/month
- PlanetScale Scaler: $29/month
- Total: ~$49/month

### Production (Medium)
- Vercel Pro: $20/month
- PlanetScale Scaler Pro: $59/month
- Total: ~$79/month
