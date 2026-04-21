import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isPublic = pathname === '/login'
  const isPortal = pathname.startsWith('/portal')
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/patients') ||
    pathname.startsWith('/appointments') || pathname.startsWith('/medical-records') ||
    pathname.startsWith('/reports') || pathname.startsWith('/admin') || pathname.startsWith('/messages')

  if (isPublic && token) {
    const payload = verifyToken(token)
    if (payload?.role === 'patient') return NextResponse.redirect(new URL('/portal', request.url))
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isDashboard) {
    const payload = verifyToken(token)
    if (payload?.role === 'patient') return NextResponse.redirect(new URL('/portal', request.url))
  }

  if (token && isPortal) {
    const payload = verifyToken(token)
    if (payload && payload.role !== 'patient') return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
