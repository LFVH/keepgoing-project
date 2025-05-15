import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function GET(
  req: NextRequest,
) {
  try {
    const userId = await verifyUser();
    if (userId instanceof NextResponse) return userId;

    const { searchParams } = new URL(req.url);
    const ativo = searchParams.get('ativo'); 
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        treinos: {
          where: {
            isAtivo: ativo !== null ? ativo === 'true' : undefined
          },
          orderBy: {
            ordem: 'asc'
          }
        }
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
    const userId = await verifyUser();
    const requestData = await req.json();
    
    if (userId instanceof NextResponse) return userId;
    if (!requestData.nome) throw new Error("O campo 'nome' é obrigatório");
    
    const { nome,
            comentarioGeral,
            corCalendario,
      } = requestData;
  
    const treinoDB = await prisma.treino.create({
      data: {
        nome,
        comentarioGeral,
        corCalendario,
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