import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const ratings = await prisma.rating.findMany({
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const avg = ratings.length
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0

    return NextResponse.json({ ratings, average: Math.round(avg * 10) / 10, total: ratings.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { score, comment } = await request.json()
    if (!score || score < 1 || score > 5) {
      return NextResponse.json({ error: 'Score must be between 1 and 5' }, { status: 400 })
    }

    // One rating per user — upsert
    const existing = await prisma.rating.findFirst({ where: { userId: payload.userId } })
    let rating
    if (existing) {
      rating = await prisma.rating.update({
        where: { id: existing.id },
        data: { score, comment: comment || null },
      })
    } else {
      rating = await prisma.rating.create({
        data: { userId: payload.userId, score, comment: comment || null },
      })
    }

    return NextResponse.json({ rating }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
  }
}
