import { NextResponse } from 'next/server'
import prisma from "@/database/prisma";
import { verifyUser } from '@/utils/verifyUserAuth';
import { logNow } from '@/utils/Logging';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = await verifyUser();
  if (userId instanceof NextResponse) 
    return userId; 

  if (!userId) {
    return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
  }

  try {
    const exercicios = await prisma.execucaoReal.findMany({
      where: {
        diario: {
          usuarioId: userId
        }
      },
      distinct: ['exercicioId'],
      select: {
        exercicio: {
          select: {
            id: true,
            nome: true,
            name: true
          }
        }
      }
    })
    const formatted = exercicios.map(e => ({
      id: e.exercicio.id,
      nome: e.exercicio.nome,
      name: e.exercicio.name
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar exercícios' },
      { status: 500 }
    )
  }
}