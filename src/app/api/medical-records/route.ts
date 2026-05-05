import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload || payload.role === 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    const records = await prisma.medicalRecord.findMany({
      where: patientId ? { patientId: parseInt(patientId) } : undefined,
      include: {
        patient: true,
        nurse: { select: { id: true, name: true } },
        appointment: { select: { id: true, appointmentDate: true, isWalkIn: true } },
      },
      orderBy: { visitDate: 'desc' },
    })

    return NextResponse.json({ records })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload || payload.role === 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { patientId, diagnosis, treatment, prescription, visitDate, appointmentId, isWalkIn } = await request.json()

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: parseInt(patientId),
        diagnosis,
        treatment,
        prescription: prescription || '',
        visitDate: new Date(visitDate),
        nurseId: payload.userId,
        isWalkIn: !!isWalkIn,
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
      },
    })

    // Mark linked appointment as completed
    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: parseInt(appointmentId) },
        data: { status: 'completed' },
      })
    }

    return NextResponse.json({ record }, { status: 201 })
  } catch (error: any) {
    console.error('[medical-records POST]', error?.message ?? error)
    return NextResponse.json({ error: error?.message || 'Failed to create medical record' }, { status: 500 })
  }
}
