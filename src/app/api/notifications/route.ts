import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
        status: 'scheduled',
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    })

    const recentPatients = await prisma.patient.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        createdAt: true,
      },
    })

    const notifications: { id: string; type: string; title: string; message: string; time: Date }[] = []

    todayAppointments.forEach((apt) => {
      notifications.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: `${apt.patient.firstName} ${apt.patient.lastName} (${apt.patient.studentId})`,
        time: apt.appointmentDate,
      })
    })

    recentPatients.forEach((patient) => {
      const timeDiff = Date.now() - new Date(patient.createdAt).getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      if (hoursDiff < 24) {
        notifications.push({
          id: `patient-${patient.id}`,
          type: 'patient',
          title: 'New Patient',
          message: `${patient.firstName} ${patient.lastName} registered`,
          time: patient.createdAt,
        })
      }
    })

    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return NextResponse.json({ 
      notifications: notifications.slice(0, 10),
      unreadCount: notifications.length,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}
