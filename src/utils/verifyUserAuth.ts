import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authHandler from "@/app/api/nxtHandle/nextAuthHandler";
import prisma from "@/database/prisma";
import { Usuario } from "@prisma/client";
import { logNow } from "./Logging";

export async function verifyUser() {
  try {
    const userDB = await userExists();
    if(userDB instanceof NextResponse) return userDB;
  
    const userId = checkPremiumExpiration(userDB);
    return userId; // Retorna o ID do usuário para ser usado nas rotas
  } catch (error) {
    logNow("verifyUser " + (error instanceof Error ? error.message : 'Ocorreu um erro!'));
    return NextResponse.json(
      { success: false, body: { message: error instanceof Error ? error.message : 'Ocorreu um erro!' } },
      { status: 400 }
    );
  }
}

export async function userExists(): Promise<Usuario | NextResponse>  {
  const session = await getServerSession(authHandler);
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, body: { message: "Usuário não autenticado." } },
        { status: 401 }
      );
    }
  
    const userId = session.id;
  
    const userExists = await prisma.usuario.findUnique({
      where: { id: userId },
    });
  
    if (!userExists || !userId) {
      return NextResponse.json(
        { success: false, body: { message: "Usuário não encontrado." } },
        { status: 400 }
      );
    }
    return userExists;
}

function checkPremiumExpiration(user: Usuario ) {
  // Get current date (without time component)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // If user has no premium dates, consider as expired
  if (!user.dtIniPremium || !user.dtFimPremium) {
      throw new Error("101 - 1");
  }

  // Normalize dates by removing time components
  const dtIni = new Date(user.dtIniPremium);
  dtIni.setHours(0, 0, 0, 0);
  
  const dtFim = new Date(user.dtFimPremium);
  dtFim.setHours(0, 0, 0, 0);

  // Check if current date is outside premium period
  if (currentDate < dtIni || currentDate >= dtFim) {
      throw new Error("101 - 2");
  }
  return user.id;
}