import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await  params).id, 10);
    const userId = await verifyUser();
    if (userId instanceof NextResponse) return userId; 
    if (isNaN(id)) return NextResponse.json({ message: "id inválido" }, { status: 400 });

    const requestData = await req.json();

    const diarioId = parseInt(requestData.diarioId)
    if (isNaN(diarioId)) return NextResponse.json({ message: "inválido" }, { status: 400 });

    await prisma.execucaoReal.deleteMany({
      where: {
        exercicioId: id,
        diario: {
          id: diarioId,
          usuarioId: userId
        }
      }
    })

    return NextResponse.json({ message: "Execuções excluídas com sucesso" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao excluir a execs" },
      { status: 500 }
    );
  }
}