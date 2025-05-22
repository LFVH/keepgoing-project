import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/utils/verifyUserAuth";
import { logNow } from "@/utils/Logging";

// Exemplo de implementação no Next.js API route
export async function GET(req: NextRequest) {
  const userId = await verifyUser();
  if (userId instanceof NextResponse) return userId; // Retorna a resposta de erro caso ocorra
  const treinos = await prisma.treino.findMany({
    where: {
      isAtivo: true,
      usuarioId: userId
    },
    select: {
      id: true,
      nome: true
    }
  })

  return NextResponse.json({ treinos })
}

/*  const { searchParams } = new URL(req.url)
  const searchTerm = searchParams.get('search') || ''
  const treinos = await prisma.treino.findMany({
    where: {
      nome: {
        contains: searchTerm,
        mode: 'insensitive'
      },
      isAtivo: true,
      usuarioId: userId
    },
    select: {
      id: true,
      nome: true
    }
  })*/