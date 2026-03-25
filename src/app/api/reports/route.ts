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

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalPatients,
      totalAppointments,
      totalRecords,
      todayAppointments,
      pendingAppointments,
      patientsThisMonth,
      appointmentsThisMonth,
      recordsThisMonth,
      patientsLastMonth,
      appointmentsLastMonth,
      malePatients,
      femalePatients,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.medicalRecord.count(),
      prisma.appointment.count({ where: { appointmentDate: { gte: startOfToday, lt: endOfToday } } }),
      prisma.appointment.count({ where: { status: 'scheduled' } }),
      prisma.patient.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.appointment.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.medicalRecord.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.patient.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.appointment.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.patient.count({ where: { gender: 'Male' } }),
      prisma.patient.count({ where: { gender: 'Female' } }),
      prisma.appointment.count({ where: { status: 'scheduled' } }),
      prisma.appointment.count({ where: { status: 'completed' } }),
      prisma.appointment.count({ where: { status: 'cancelled' } }),
    ])

    const patientTrend = patientsLastMonth > 0
      ? ((patientsThisMonth - patientsLastMonth) / patientsLastMonth * 100).toFixed(1)
      : '0'
    const appointmentTrend = appointmentsLastMonth > 0
      ? ((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      overview: {
        totalPatients,
        totalAppointments,
        totalRecords,
        todayAppointments,
        pendingAppointments,
        patientsThisMonth,
        appointmentsThisMonth,
        recordsThisMonth,
        trends: {
          patients: { value: patientTrend, isPositive: parseFloat(patientTrend) >= 0 },
          appointments: { value: appointmentTrend, isPositive: parseFloat(appointmentTrend) >= 0 },
        },
      },
      demographics: { male: malePatients, female: femalePatients },
      appointments: {
        scheduled: scheduledAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
