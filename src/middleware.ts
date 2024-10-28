import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  // Список захищених маршрутів
  const protectedPaths = ['/dashboard', '/profile']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      verify(token.value, process.env.JWT_SECRET!)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}