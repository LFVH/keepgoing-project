import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authHandler from "../nxtHandle/nextAuthHandler";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function GET(
  req: NextRequest,
) {
  try {
    const userId = await verifyUser(req);
    if (userId instanceof NextResponse) return userId; // Retorna a resposta de erro caso ocorra

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
    const session = await getServerSession(authHandler);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, body: { message: "Usuário não autenticado." } },
        { status: 401 }
      );
    }

    const { nome = "", slug = "", createdAt = new Date().toISOString() } = await req.json();
    const userId = session.user.id;

    // Verificar se o usuário existe no banco de dados
    const [verifyIfUserExistsOnDB] = await Promise.all([
      prisma.usuario.findUnique({ where: { id: userId } }),
    ]);

    if (!verifyIfUserExistsOnDB) {
      return NextResponse.json(
        { success: false, body: { message: "Usuário não encontrado." } },
        { status: 400 }
      );
    }
    

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
        body: {
          message: "Treino criado com sucesso.",
          data: { id: treinoDB.id }
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    return NextResponse.json(
      { success: false, body: { message: "Houve um erro no servidor" } },
      { status: 500 }
    );
  }
}