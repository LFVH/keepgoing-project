import prisma from "@/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/utils/verifyUserAuth";

// Exemplo de implementação no Next.js API route
export async function GET(req: NextRequest) {
  const userId = await verifyUser();
  if (userId instanceof NextResponse) return userId; // Retorna a resposta de erro caso ocorra

  const exercicios = await prisma.exercicio.findMany({
    select: {
      id: true,
      nome: true
    }
  })

  return NextResponse.json({ exercicios })
}   