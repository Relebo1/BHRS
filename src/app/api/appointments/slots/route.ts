import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const SLOT_HOURS = [8, 9, 10, 11, 14, 15, 16] // clinic hours

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    if (!dateStr) return NextResponse.json({ error: 'Date required' }, { status: 400 })

    const date = new Date(dateStr)
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({ slots: [], message: 'Clinic is closed on weekends' })
    }

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const booked = await prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: dayStart, lte: dayEnd },
        status: { not: 'cancelled' },
      },
      select: { appointmentDate: true },
    })

    const bookedHours = booked.map(a => new Date(a.appointmentDate).getHours())

    const slots = SLOT_HOURS.map(hour => {
      const slotDate = new Date(date)
      slotDate.setHours(hour, 0, 0, 0)
      return {
        time: slotDate.toISOString(),
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        available: !bookedHours.includes(hour) && slotDate > new Date(),
      }
    })

    return NextResponse.json({ slots })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}
