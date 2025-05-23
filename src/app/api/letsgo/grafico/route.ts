import { NextResponse } from 'next/server'
import prisma from "@/database/prisma";
import { verifyUser } from '@/utils/verifyUserAuth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = await verifyUser();
  if (userId instanceof NextResponse) {
    return userId;} 
  const exercicioId = searchParams.get('exercicioId')

  if (!userId) {
    return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
  }

  try {
    const linhasDiario = await prisma.linhasDiario.findMany({
      where: {
        usuarioId: userId,
        // Filtro por exercício se fornecido
        ...(exercicioId && {
          execucoes: {
            some: {
              exercicioId: Number(exercicioId)
            }
          }
        })
      },
      select: {
        id: true,
        data: true,
        execucoes: {
          // Aplicar o mesmo filtro nas execuções
          ...(exercicioId && {
            where: {
              exercicioId: Number(exercicioId)
            }
          }),
          select: {
            reps: true,
            sets: true,
            carga: true,
            exercicioId: true
          }
        },
        treino: {
          select: {
            id: true,
            execucoes: {
              // Aplicar o mesmo filtro nas execuções planejadas
              ...(exercicioId && {
                where: {
                  exercicioId: Number(exercicioId)
                }
              }),
              select: {
                reps: true,
                sets: true,
                carga: true,
                exercicioId: true
              }
            }
          }
        }
      },
      orderBy: { data: 'asc' }
    })

    return NextResponse.json(linhasDiario)
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar dados de progresso' },
      { status: 500 }
    )
  }
}