import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let contacts: any[] = []

    if (payload.role === 'patient') {
      // Patients see all nurses
      contacts = await prisma.user.findMany({
        where: { role: 'nurse' },
        select: { id: true, name: true, role: true },
      })
    } else if (payload.role === 'nurse' || payload.role === 'admin') {
      // Nurses/admin see all patients who have user accounts
      const patients = await prisma.patient.findMany({
        where: { userId: { not: null } },
        include: { user: { select: { id: true, name: true, role: true } } },
      })
      contacts = patients
        .filter(p => p.user)
        .map(p => ({ id: p.user!.id, name: p.user!.name, role: 'patient', studentId: p.studentId }))
    }

    return NextResponse.json({ contacts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}
