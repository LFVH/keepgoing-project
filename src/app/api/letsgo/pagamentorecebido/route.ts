import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function PUT(req: NextRequest) {
  try {
    const userId = await verifyUser();
    const requestData = await req.json();
    
    if (userId instanceof NextResponse) return userId; 
    if (!requestData.nome) return NextResponse.json({ message: "O campo 'nome' é obrigatório" }, { status: 400 });
    
    const { 
      nome,
      comentarioGeral,
      corCalendario,
      } = requestData;
    const dataAtual = new Date(); // Data atual
    const dataFimPremium = new Date();
    dataFimPremium.setDate(dataAtual.getDate() + 7); // Adiciona 7 dias


    const usuarioDB = await prisma.usuario.update({
      where: { id: userId },
      data: {
        dtFimPremium: dataFimPremium,
        dtIniPremium: dataAtual
      },
      
    });

    return NextResponse.json(
      {
        success: true,
        message: "User atualizado com sucesso.",
        data: { id: usuarioDB.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao atualizar User:", error);
    return NextResponse.json(
      { success: false,  message: "Houve um erro no servidor" },
      { status: 500 }
    );
  }
}