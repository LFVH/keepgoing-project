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

    await prisma.linhasDiario.delete({
      where: { id,
        usuarioId: userId,
       },
    });

    return NextResponse.json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao excluir" },
      { status: 500 }
    );
  }
}

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

    const linha = await prisma.linhasDiario.findUnique({
      where: { id, usuarioId: userId },
      include: {
        execucoes: {
          include: {
            exercicio: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        treino: true,
      },
    });

    if (!linha) {
      return NextResponse.json({ message: "Registro não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Registro obtido", linha });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao obter registro" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await verifyUser(req);
    const requestData = await req.json();
    const id = parseInt((await  params).id, 10);
    
    if (userId instanceof NextResponse) return userId; 
    if (!requestData.data) return NextResponse.json({ message: "O campo 'data' é obrigatório" }, { status: 400 });
    if (isNaN(id)) return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    
    const { 
      data,
      pesoCorporal,
      treinoId,
      } = requestData;

    const linhaDiarioDB = await prisma.linhasDiario.update({
      where: { id, usuarioId: userId },
      data: {
        data: new Date(data),
        pesoCorporal: pesoCorporal !== undefined ? isNaN(parseFloat(pesoCorporal)) ? null : parseFloat(pesoCorporal) : null,
        treino: { connect: { id: parseInt(treinoId) } },
      },
      
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registro atualizado com sucesso.",
        data: { id: linhaDiarioDB.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
    return NextResponse.json(
      { success: false,  message: "Houve um erro no servidor" },
      { status: 500 }
    );
  }
}
