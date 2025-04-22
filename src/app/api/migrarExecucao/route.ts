import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/database/prisma';
import { verifyUser } from '@/utils/verifyUserAuth';

export default async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ treinoId: string }> }
) {
  try {
    const userId = await verifyUser(req);
    const requestData = await req.json();
    const treinoId = parseInt((await  params).treinoId, 10);
    
    if (userId instanceof NextResponse) return userId; 
    if (!requestData.nome) return NextResponse.json({ message: "O campo 'nome' é obrigatório" }, { status: 400 });
    if (isNaN(treinoId)) return NextResponse.json({ message: "ID inválido" }, { status: 400 });

    if (!requestData.data) throw new Error("O campo 'data' é obrigatório");
    
    const { 
            data,
            pesoCorporal,
            comentarioGeral,
      } = requestData;

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
      return NextResponse.json({ error: 'Treino não encontrado' }, { status: 404 });
    }

    // Cria a linha conectando as execuções existentes
    const linhaDB = await prisma.linhasDiario.create({
      data: {
        data: new Date(data),
        pesoCorporal: pesoCorporal !== undefined ? isNaN(parseFloat(pesoCorporal)) ? null : parseFloat(pesoCorporal) : null,
        comentarioGeral,
        usuario: { connect: { id: userId } },
        treino: { connect: { id: treinoId } },
        execucoes: {
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
        data: { id: linhaDB.id }
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