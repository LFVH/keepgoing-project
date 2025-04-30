import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await  params).id, 10);
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) return userId; 
    if (isNaN(id)) return NextResponse.json({ message: "id inválido" }, { status: 400 });

    const requestData = await req.json();
    
    const diarioId = parseInt(requestData.diarioId)
    if (isNaN(diarioId)) return NextResponse.json({ message: "inválido" }, { status: 400 });

    await prisma.execucaoReal.delete({
      where: {
        id: id,
        diario: {
          id: diarioId,
          usuarioId: userId
        }
      }
    })

    return NextResponse.json({ message: "Execução excluída com sucesso" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao excluir a treino" },
      { status: 500 }
    );
  }
}
/*
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) {
      return userId;} 

    const id = parseInt((await  params).id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const treino = await prisma.treino.findUnique({
      where: { id, usuarioId: userId },
      include: {
        execucoes: {
          include: {
            exercicio: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!treino) {
      return NextResponse.json({ message: "Treino não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Treino obtido", treino });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao obter treino" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifyUser(req);
    const requestData = await req.json();
    const id = parseInt((await  params).id, 10);
    
    if (userId instanceof NextResponse) return userId; 
    if (!requestData.nome) return NextResponse.json({ message: "O campo 'nome' é obrigatório" }, { status: 400 });
    if (isNaN(id)) return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    
    const { 
      nome,
      comentarioGeral,
      corCalendario,
      } = requestData;

    const treinoDB = await prisma.treino.update({
      where: { id, usuarioId: userId },
      data: {
        nome,
        comentarioGeral,
        corCalendario,
        usuario: { connect: { id: userId } },
      },
      
    });

    return NextResponse.json(
      {
        success: true,
        message: "Treino atualizado com sucesso.",
        data: { id: treinoDB.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao atualizar treino:", error);
    return NextResponse.json(
      { success: false,  message: "Houve um erro no servidor" },
      { status: 500 }
    );
  }
}
*/