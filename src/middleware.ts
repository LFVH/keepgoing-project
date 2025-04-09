import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export { default } from "next-auth/middleware"
export const config = { matcher: [    "/letsgo/:path*",
    "/api/:path*"] }

export function middleware(request: NextRequest) {
    // Verifica se é uma requisição para a API
    if (request.nextUrl.pathname.startsWith('/api')) {
      const origin = request.headers.get('origin')
      const allowedDomain = process.env.ALLOWED_DOMAIN || process.env.NEXTAUTH_URL

      
      if (origin && origin !== allowedDomain) {
        return new NextResponse('Acesso não autorizado', { status: 403 })
      }
    }
    
    return NextResponse.next()
  }


  /**
   * SE APIs são consumidas com tokens JWT (como em mobile apps):

typescript
Copy
// src/middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const path = req.nextUrl.pathname

  // Rotas protegidas
  if (path.startsWith('/api/private')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    // Verifica token JWT no Authorization header para APIs
    const authHeader = req.headers.get('authorization')
    const apiToken = authHeader?.split(' ')[1]
    
    if (!token && !apiToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}
   */