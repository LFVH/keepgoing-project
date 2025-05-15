import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { Usuario } from "@prisma/client"
import prisma from "./database/prisma"

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
  
  if (request.nextUrl.pathname.startsWith('/api/letsgo') || request.nextUrl.pathname.startsWith('/letsgo')) {
  console.log("passou 1")
  console.log(request.nextUrl.pathname)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: false,
  });
  console.log("passou 2")
  const authResult = await authMiddleware(request as NextRequestWithAuth, event)
  console.log("passou 3")
  if (authResult) return authResult
  console.log("passou 4")
  // Extrai o token JWT decodificado (já verificado pelo NextAuth)
  if (!token?.sub) {
    console.log("passou 5")
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    )
  }
  console.log("passou 6")
  // Agora você tem o ID do usuário!
  const sub = token.sub
  console.log("sub")
  console.log(sub)
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    const allowedDomain = process.env.ALLOWED_DOMAIN || process.env.NEXTAUTH_URL

    if (origin && origin !== allowedDomain) {
      return new NextResponse('Acesso não autorizado', { status: 403 })
    }
  }
  try
  {
    console.log("passou aqui")
    const userId = await verifyUserMw(sub);
    if (userId instanceof NextResponse){ 
      const errorData = await userId.json()
      if (errorData.message?.startsWith('101')) {
        return NextResponse.redirect(new URL('/pagamento', request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch(error){
    console.log("error");
    console.log(error);
    return NextResponse.next()
  }
}

  return NextResponse.next()
}

async function verifyUserMw(userId: string) {
  try {
    console.log("entrou aqui");
    // Verifica se o usuário existe no banco de dados
    const userExists = await prisma.usuario.findUnique({
      where: { id: userId },
    });
  
    if (!userExists || !userId) {
      return NextResponse.json(
        { success: false, body: { message: "Usuário não encontrado." } },
        { status: 400 }
      );
    }
  
    checkPremiumExpiration(userExists);
  
    return userId
  } catch (error) {
    console.error('verifyUserMw error:', error)
    return NextResponse.json(
      { success: false, body: { message: error instanceof Error ? error.message : 'Ocorreu um erro!' } },
      { status: 400 }
    );
  }
}

function checkPremiumExpiration(user: Usuario ): void {
  // Get current date (without time component)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // If user has no premium dates, consider as expired
  if (!user.dtIniPremium || !user.dtFimPremium) {
      throw new Error("101 - 1");
  }

  // Normalize dates by removing time components
  const dtIni = new Date(user.dtIniPremium);
  dtIni.setHours(0, 0, 0, 0);
  
  const dtFim = new Date(user.dtFimPremium);
  dtFim.setHours(0, 0, 0, 0);

  // Check if current date is outside premium period
  if (currentDate < dtIni || currentDate > dtFim) {
      throw new Error("101 - 2");
  }
}