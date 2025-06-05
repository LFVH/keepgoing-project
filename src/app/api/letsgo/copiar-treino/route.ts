import { NextResponse } from 'next/server';
import prisma from "@/database/prisma";
import { verifyUser } from '@/utils/verifyUserAuth';

export async function POST(request: Request) {
  const userId = await verifyUser();
  if (userId instanceof NextResponse) return userId; 
  try {
    const { treinoId } = await request.json();

    // 1. Buscar o treino original
    const treinoOriginal = await prisma.treino.findUnique({
      where: { id: treinoId, usuarioId: userId},
      include: {
        execucoes: true,
        linhasDiario: true,
      },
    });

    if (!treinoOriginal) {
      return NextResponse.json(
        { error: 'Treino não encontrado' },
        { status: 404 }
      );
    }

    // 2. Criar o novo treino (cópia)
    const novoTreino = await prisma.treino.create({
      data: {
        nome: `Cópia - ${treinoOriginal.nome}`,
        comentarioGeral: treinoOriginal.comentarioGeral,
        corCalendario: treinoOriginal.corCalendario,
        usuarioId: treinoOriginal.usuarioId,
        isAtivo: true,
        // Outros campos conforme necessário
      },
    });

    // 4. Copiar as execucoes
    if (treinoOriginal.execucoes.length > 0) {
      await prisma.execucaoPlano.createMany({
        data: treinoOriginal.execucoes.map(execucao => ({
          ...execucao,
          id: undefined, // Para criar novo ID
          treinoId: novoTreino.id,
          // Ajustar outros campos conforme necessário
        })),
      });
    }

    return NextResponse.json(novoTreino, { status: 201 });
  } catch (error) {
    console.error('Erro ao copiar treino:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}