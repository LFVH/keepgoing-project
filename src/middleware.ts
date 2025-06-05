import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"
import { logNow } from "./utils/Logging"
import { getToken } from "next-auth/jwt"

export const config = {
  matcher: ["/:path*"],
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
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (request.nextUrl.pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/letsgo", request.url));
  }
  if (request.nextUrl.pathname.startsWith('/api/letsgo') || request.nextUrl.pathname.startsWith('/letsgo')) {
    const authResult = await authMiddleware(request as NextRequestWithAuth, event)
    if (authResult) return authResult
    if (request.nextUrl.pathname.startsWith('/api')) {
      const origin = request.headers.get('origin')
      const allowedDomain = process.env.ALLOWED_DOMAIN || process.env.NEXTAUTH_URL

      if (origin && origin !== allowedDomain) {
        return new NextResponse('Acesso não autorizado', { status: 403 })
      }
    }
    try {
      const response  = await fetch(`${request.nextUrl.origin}/api/auth-v`, { 
        method: "GET",
        headers: { Cookie: request.headers.get("Cookie") || "" }
      });
      const data = await response.json()
      if (!data.userId) {
        if (data.body?.message?.startsWith('101 - 2')) {
          return NextResponse.redirect(new URL('/checkout', request.url))
        } else if (data.body?.message?.startsWith('101 - 1')) {
          return NextResponse.redirect(new URL('/404', request.url))
        }
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch(error){
      console.log(error);
      return NextResponse.redirect(new URL('/', request.url))
    }
}
  return NextResponse.next()
}