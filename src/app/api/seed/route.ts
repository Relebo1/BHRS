import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { execSync } from 'child_process'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-seed-secret')
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
  } catch (e) {
    return NextResponse.json({ error: 'Schema push failed' }, { status: 500 })
  }

  const users = [
    { name: 'Admin User', email: 'admin@botho.ac.bw', password: 'admin123', role: 'admin' },
    { name: 'Dr. Relebohile Sekutlu', email: 'doctor@botho.ac.bw', password: 'doctor123', role: 'doctor' },
    { name: 'Nurse Palesa Mokoena', email: 'nurse@botho.ac.bw', password: 'nurse123', role: 'nurse' },
  ]

  const created = []
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10)
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, password: hashed, role: u.role as any },
    })
    created.push(user.email)
  }

  return NextResponse.json({ message: 'Seed complete', users: created })
}
