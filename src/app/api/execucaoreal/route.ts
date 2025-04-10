import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function GET(
  req: NextRequest,
) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) {
      return userId;} 


    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        treinos: true
      },
    });

    return NextResponse.json({ data: usuario?.treinos });
  } catch (error) {
    console.log("Erro busca treinos "+ error);
    return NextResponse.json({ error: "Erro ao buscar treinos " }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) return userId;
    const requestData = await req.json();

    const { 
      diarioId,
      exercicioId,
      reps,             
      sets,             
      carga,             
      tempo,             
      comentarioExecucao,
      percepcao
  } = requestData;
  
  const execucaoInsert = {
    diarioId: isNaN(parseInt(diarioId)) ? null : parseInt(diarioId),
    exercicioId: isNaN(parseInt(exercicioId)) ? null : parseInt(exercicioId),
    reps: reps !== undefined ? (isNaN(parseInt(reps)) ? null : parseInt(reps)) : null,
    sets: sets !== undefined ? (isNaN(parseInt(sets)) ? null : parseInt(sets)) : null,
    carga: carga !== undefined ? (isNaN(parseFloat(carga)) ? null : parseFloat(carga)) : null,
    tempo: tempo !== undefined ? (isNaN(parseInt(tempo)) ? null : parseInt(tempo)) : null,
    comentarioExecucao: comentarioExecucao || null,
    percepcao: percepcao || null
};

  if (!execucaoInsert.diarioId || !execucaoInsert.exercicioId) throw new Error("Missing fields.");
  
  if(!(await prisma.treino.findUnique({
    where: { id: execucaoInsert.diarioId, usuarioId: userId },
    select: { id: true }
  }))) throw new Error("Treino não encontrado.");
  
    const execucaoDB = await prisma.execucaoReal.create({
      data: { reps: execucaoInsert.reps ,             
        sets : execucaoInsert.sets,             
        carga: execucaoInsert.carga,             
        tempo: execucaoInsert.tempo,
        percepcao,             
        comentarioExecucao,
        diario: { connect: { id: execucaoInsert.diarioId } },
        exercicio: { connect: { id: execucaoInsert.exercicioId } },
       },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Execucao para exercicio criada com sucesso.",
        data: { id: execucaoDB.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar execucao:", error);
    return NextResponse.json(
      { success: false,  message: "Houve um erro no servidor" },
      { status: 500 }
    );
  }
}