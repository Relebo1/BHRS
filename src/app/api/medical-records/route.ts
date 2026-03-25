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
    const patientId = searchParams.get('patientId')

    const records = await prisma.medicalRecord.findMany({
      where: patientId ? { patientId: parseInt(patientId) } : undefined,
      include: {
        patient: true,
        doctor: { select: { id: true, name: true } },
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

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { patientId, diagnosis, treatment, prescription, visitDate } = await request.json()

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: parseInt(patientId),
        diagnosis,
        treatment,
        prescription: prescription || '',
        visitDate: new Date(visitDate),
        doctorId: payload.userId,
      },
    })

    return NextResponse.json({ record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 })
  }
}
