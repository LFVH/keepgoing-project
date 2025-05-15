import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database/prisma';
import { verifyUser } from '@/utils/verifyUserAuth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ treinoId: string }> }
) {
  try {
    const userId = await verifyUser();
    const requestData = await req.json();
    const treinoId = parseInt((await  params).treinoId, 10);
    
    if (userId instanceof NextResponse) return userId; 
    if (!requestData.diarioId) return NextResponse.json({ message: "O campo 'di' é obrigatório" }, { status: 400 });
    if (isNaN(treinoId)) return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    
    const diarioId  = parseInt(requestData.diarioId);
    if (isNaN(diarioId)) return NextResponse.json({ message: "inválido" }, { status: 400 });
    
    // Busca o treino com suas execuções
    const treinoDB = await prisma.treino.findUnique({
        where: { id: treinoId, usuarioId: userId },
        include: { 
          execucoes: {
            include: {
              exercicio: true 
            }
          } 
        },
      });
    if (!treinoDB) {
      return NextResponse.json({ error: '103 não encontrado' }, { status: 404 });
    }

    const linhaDB = await prisma.linhasDiario.findUnique({
      where: { id: diarioId, usuarioId: userId },
    });
  if (!linhaDB) {
    return NextResponse.json({ error: '102 não encontrado' }, { status: 404 });
  }

    // Cria a linha conectando as execuções existentes
    const upLinhaDB = await prisma.linhasDiario.update({
      where: { id: linhaDB.id, usuarioId: userId },
      data: {
        treino: { connect: { id: treinoId } },
        execucoes: {
          deleteMany: {},
            create: treinoDB.execucoes.map(exec => ({
              reps: exec.reps   || null,
              sets: exec.sets   || null,
              carga: exec.carga || null,
              tempo: exec.tempo || null,
              comentarioExecucao: exec.comentarioExecucao || undefined,
              exercicio: {
                connect: { id: exec.exercicio.id }
              }
            }))
        },
    },
      include: {
        execucoes: true,
      },
    });

    
    return NextResponse.json(
        {
        success: true,
        message: "Execucao Plano X Real migrada com sucesso.",
        data: { id: upLinhaDB.id }
        },
        { status: 201 }
    );
  } catch (error) {
    console.error('Erro migração:', error);
    return NextResponse.json(
      { error: 'Houve erro no servidor' },
      { status: 500 }
    );
  }
}