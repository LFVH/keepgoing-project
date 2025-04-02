import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authHandler from "../nxtHandle/nextAuthHandler";
import prisma from "@/database/prisma";

export async function GET(
  req: NextRequest,
) {
  try {
    // Obtendo o usuário autenticado
    const session = await getServerSession(authHandler);

    console.log(session);
    if (!session?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }


    const usuario = await prisma.usuario.findUnique({
      where: { id: session.id },
      include: {
        treinos: true
      },
    });

    return NextResponse.json({ data: usuario?.treinos });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar treinos" + error}, { status: 500 });
  }
}
