import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authHandler from "@/app/api/nxtHandle/nextAuthHandler";
import prisma from "@/database/prisma";

export async function verifyUser(req: NextRequest) {
  const session = await getServerSession(authHandler);
  if (!session || !session.id) {
    return NextResponse.json(
      { success: false, body: { message: "Usuário não autenticado." } },
      { status: 401 }
    );
  }

  const userId = session.id;

  // Verifica se o usuário existe no banco de dados
  const userExists = await prisma.usuario.findUnique({
    where: { id: userId },
  });

  if (!userExists || !userId) {
    return NextResponse.json(
      { success: false, body: { message: "Usuário não encontrado." } },
      { status: 400 }
    );
  }

  return userId; // Retorna o ID do usuário para ser usado nas rotas
}
