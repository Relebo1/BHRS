import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DEFAULT_USERS = [
  { name: 'Admin User',     email: 'admin@botho.ac.bw',  password: 'admin123',  role: 'admin'  },
  { name: 'Dr. John Doe',   email: 'doctor@botho.ac.bw', password: 'doctor123', role: 'doctor' },
  { name: 'Nurse Jane Doe', email: 'nurse@botho.ac.bw',  password: 'nurse123',  role: 'nurse'  },
]

async function seedUsers(client: PrismaClient) {
  let seeded = 0
  for (const u of DEFAULT_USERS) {
    const exists = await client.user.findUnique({ where: { email: u.email } })
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10)
      await client.user.create({
        data: { name: u.name, email: u.email, password: hashed, role: u.role }
      })
      seeded++
      console.log(`   👤 ${u.name} (${u.role}) — ${u.email} / ${u.password}`)
    }
  }
  if (seeded > 0) {
    console.log(`✅ ${seeded} default user(s) created.\n`)
  } else {
    console.log('👥 Default users already exist — skipping.\n')
  }
}

async function pushSchema(client: PrismaClient) {
  // In production (Vercel), schema is pushed at build time via postinstall.
  // In development, push schema via CLI before running dev server.
  if (process.env.NODE_ENV === 'production') {
    console.log('\n🔌 Connecting to TiDB Cloud...')
    try {
      await client.$connect()
      console.log('✅ Database connected successfully.\n')
      console.log('🌱 Checking default users...')
      await seedUsers(client)
    } catch (e: any) {
      console.error('❌ Database connection failed:', e.message)
    }
    return
  }

  // Development: run db push via CLI
  const { execSync } = await import('child_process')
  try {
    console.log('\n🔌 Connecting to database...')
    const output = execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
      env: process.env,
    }).toString()

    if (output.includes('Your database is now in sync') || output.includes('already in sync')) {
      console.log('✅ Database connected successfully.')
      console.log('📋 Tables already exist — no changes needed.')
    } else if (output.includes('created')) {
      console.log('✅ Database connected successfully.')
      console.log('🛠️  Tables created:')
      output.split('\n')
        .filter(l => l.includes('created') || l.includes('Creating'))
        .forEach(l => console.log(`   → ${l.trim()}`))
    } else if (output.includes('drift') || output.includes('change')) {
      console.log('✅ Database connected successfully.')
      console.log('🔄 Tables updated to match current schema.')
    } else {
      console.log('✅ Database connected successfully.')
      console.log('📋 Schema initialised.')
    }

    console.log('\n🌱 Checking default users...')
    await seedUsers(client)
  } catch (error: any) {
    const msg: string = error?.stdout?.toString() || error?.message || String(error)
    if (msg.includes('connect') || msg.includes('ECONNREFUSED') || msg.includes('Access denied')) {
      console.error('❌ Database connection failed. Check your DATABASE_URL in .env\n')
    } else {
      console.error('❌ Database initialisation error:', msg, '\n')
    }
  }
}

function createClient() {
  const client = new PrismaClient()
  pushSchema(client).catch(e => console.error('DB init error:', e))
  return client
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createClient())
