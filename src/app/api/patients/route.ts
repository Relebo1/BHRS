import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload || payload.role === 'patient') {
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
      include: { user: { select: { email: true } } },
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
    const payload = verifyToken(token || '')
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can add patients' }, { status: 403 })
    }

    const { studentId, firstName, lastName, gender, dateOfBirth, phone, address, email, password } = await request.json()

    // Create user account for patient
    const hashedPassword = await hashPassword(password || studentId) // default password = studentId
    const user = await prisma.user.create({
      data: { name: `${firstName} ${lastName}`, email, password: hashedPassword, role: 'patient' },
    })

    const patient = await prisma.patient.create({
      data: {
        studentId, firstName, lastName, gender,
        dateOfBirth: new Date(dateOfBirth),
        phone, address, userId: user.id,
      },
    })

    // Notify all nurses
    const nurses = await prisma.user.findMany({ where: { role: 'nurse' }, select: { id: true } })
    await prisma.notification.createMany({
      data: nurses.map(n => ({
        userId: n.id,
        title: 'New Patient Registered',
        message: `${firstName} ${lastName} (${studentId}) has been added to the system.`,
        type: 'patient',
      })),
    })

    return NextResponse.json({ patient, userEmail: email }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Student ID or email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}
