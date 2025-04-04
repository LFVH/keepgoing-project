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
    if (userId instanceof NextResponse) return userId; // Retorna a resposta de erro caso ocorra


    await prisma.treino.delete({
      where: { id,
        usuarioId: userId,
       },
    });

    return NextResponse.json({ message: "Treino excluída com sucesso" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao excluir a treino" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await  params).id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const treino = await prisma.treino.findUnique({
      where: { id },
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

export async function PUT(
  req: NextRequest,
  
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await  params).id, 10);

    await prisma.treino.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Treino excluída com sucesso" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao excluir a treino" },
      { status: 500 }
    );
  }
}
