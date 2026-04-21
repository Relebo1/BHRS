import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const withUserId = parseInt(searchParams.get('with') || '0')

    const where = withUserId
      ? {
          OR: [
            { senderId: payload.userId, receiverId: withUserId },
            { senderId: withUserId, receiverId: payload.userId },
          ],
        }
      : {
          OR: [{ senderId: payload.userId }, { receiverId: payload.userId }],
        }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Mark received messages as read
    if (withUserId) {
      await prisma.message.updateMany({
        where: { senderId: withUserId, receiverId: payload.userId, read: false },
        data: { read: true },
      })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { receiverId, content } = await request.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })

    const message = await prisma.message.create({
      data: { senderId: payload.userId, receiverId: parseInt(receiverId), content },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: parseInt(receiverId),
        title: 'New Message',
        message: `${message.sender.name} sent you a message.`,
        type: 'message',
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
