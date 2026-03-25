import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const patients = await prisma.patient.findMany({
      where: search ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { studentId: { contains: search } },
        ],
      } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ patients })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, firstName, lastName, gender, dateOfBirth, phone, address } = await request.json()

    const patient = await prisma.patient.create({
      data: { studentId, firstName, lastName, gender, dateOfBirth: new Date(dateOfBirth), phone, address },
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Student ID already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}
