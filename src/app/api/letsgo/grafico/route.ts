import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function GET(
  req: NextRequest,
) {
  try {
    const userId = await verifyUser();
    if (userId instanceof NextResponse) {
      return userId;} 


    const linhasDiarioComExecucoes = await prisma.linhasDiario.findMany({
  where: { usuarioId: userId },
  select: {
    id: true,
    data: true,
    pesoCorporal: true,
    comentarioGeral: true,
    execucoes: true,
    treino: {
      select: {
        id: true,
        nome: true,
        corCalendario: true,
        execucoes: true
      }
    }
  },
  orderBy: { data: 'asc' }
});
    return NextResponse.json({ data: linhasDiarioComExecucoes });
  } catch (error) {
    console.log("Erro busca diário "+ error);
    return NextResponse.json({ error: "Erro ao buscar registros do diário " }, { status: 500 });
  }
}