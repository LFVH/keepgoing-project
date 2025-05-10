import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

export const config = {
  matcher: ["/letsgo/:path*", "/api/:path*"],
}

const authMiddleware = withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', 
    error: '/',
  },
  callbacks: {
    authorized({ token }) {
      return !!token
    },
  },
})

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const authResult = await authMiddleware(request as NextRequestWithAuth, event)
  if (authResult) return authResult

  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const allowedDomain = process.env.ALLOWED_DOMAIN || process.env.NEXTAUTH_URL

    if (origin && origin !== allowedDomain) {
      return new NextResponse('Acesso não autorizado', { status: 403 })
    }
  }

  return NextResponse.next()
}
