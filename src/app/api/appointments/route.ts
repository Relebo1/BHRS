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
    const status = searchParams.get('status')

    const appointments = await prisma.appointment.findMany({
      where: status ? { status } : undefined,
      include: { patient: true },
      orderBy: { appointmentDate: 'desc' },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { patientId, appointmentDate, status, notes } = await request.json()

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(patientId),
        appointmentDate: new Date(appointmentDate),
        status: status || 'scheduled',
        notes: notes || null,
      },
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
