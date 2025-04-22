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
        linhasDiario: {
          include: {
            treino: {
              select: {
                id: true,
                nome: true,
                corCalendario: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: usuario?.linhasDiario });
  } catch (error) {
    console.log("Erro busca diário "+ error);
    return NextResponse.json({ error: "Erro ao buscar registros do diário " }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyUser(req);
    const requestData = await req.json();
    
    if (userId instanceof NextResponse) return userId;
    if (!requestData.data) throw new Error("O campo 'data' é obrigatório");
    
    const { 
            data,
            pesoCorporal,
            comentarioGeral,
            treinoId,
      } = requestData;
  
    const diarioDB = await prisma.linhasDiario.create({
      data: {
        data: new Date(data),
        pesoCorporal: pesoCorporal !== undefined ? isNaN(parseFloat(pesoCorporal)) ? null : parseFloat(pesoCorporal) : null,
        comentarioGeral,
        usuario: { connect: { id: userId } },
        treino: { connect: { id: parseInt(treinoId) } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registro criado com sucesso.",
        data: { id: diarioDB.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar registro:", error);
    return NextResponse.json(
      { success: false,  message: "Houve um erro no servidor" },
      { status: 500 }
    );
  }
}