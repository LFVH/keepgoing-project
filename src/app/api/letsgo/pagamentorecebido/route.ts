import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { userExists, verifyUser } from "@/utils/verifyUserAuth";

export async function PUT(req: NextRequest) {
  try {
    const userDB = await userExists();
    const requestData = await req.json();
    
    if (userDB instanceof NextResponse) return userDB; 
    //if (!requestData.nome) return NextResponse.json({ message: "O campo 'nome' é obrigatório" }, { status: 400 });
    
    const { 
      nome,
      comentarioGeral,
      corCalendario,
      } = requestData;
    const dataAtual = new Date(); // Data atual
    const dataFimPremium = new Date();
    dataFimPremium.setDate(dataAtual.getDate() + 36500); // Adiciona 7 dias


    const usuarioDB = await prisma.usuario.update({
      where: { id: userDB.id },
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