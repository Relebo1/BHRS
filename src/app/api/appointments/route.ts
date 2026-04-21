import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Patients only see their own appointments
    let where: any = status ? { status } : {}
    if (payload.role === 'patient' && payload.patientId) {
      where = { ...where, patientId: payload.patientId }
    }

    const appointments = await prisma.appointment.findMany({
      where,
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
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    let { patientId, appointmentDate, notes } = body

    // Patients book for themselves
    if (payload.role === 'patient') {
      if (!payload.patientId) return NextResponse.json({ error: 'Patient profile not found' }, { status: 400 })
      patientId = payload.patientId
    }

    // Check slot not already taken
    const slotDate = new Date(appointmentDate)
    const slotStart = new Date(slotDate)
    slotStart.setMinutes(0, 0, 0)
    const slotEnd = new Date(slotStart)
    slotEnd.setHours(slotStart.getHours() + 1)

    const conflict = await prisma.appointment.findFirst({
      where: {
        appointmentDate: { gte: slotStart, lt: slotEnd },
        status: { not: 'cancelled' },
      },
    })

    if (conflict) return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(patientId),
        appointmentDate: slotDate,
        status: 'scheduled',
        notes: notes || null,
      },
      include: { patient: true },
    })

    // Notify nurses
    const nurses = await prisma.user.findMany({ where: { role: 'nurse' }, select: { id: true } })
    await prisma.notification.createMany({
      data: nurses.map(n => ({
        userId: n.id,
        title: 'New Appointment',
        message: `${appointment.patient.firstName} ${appointment.patient.lastName} booked an appointment on ${slotDate.toLocaleDateString()}.`,
        type: 'appointment',
      })),
    })

    // Notify patient
    if (payload.role === 'patient') {
      await prisma.notification.create({
        data: {
          userId: payload.userId,
          title: 'Appointment Confirmed',
          message: `Your appointment on ${slotDate.toLocaleDateString()} at ${slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} has been scheduled.`,
          type: 'appointment',
        },
      })
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
