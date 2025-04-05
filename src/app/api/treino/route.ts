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
    if (userId instanceof NextResponse) {
      return userId;} 

    const requestData = await req.json();
    const { nome } = requestData;

    // Criar página no banco de dados
    const treinoDB = await prisma.treino.create({
      data: {
        nome,
        usuario: { connect: { id: userId } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Treino criado com sucesso.",
        data: { id: treinoDB.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    return NextResponse.json(
      { success: false,  message: "Houve um erro no servidor" },
      { status: 500 }
    );
  }
}