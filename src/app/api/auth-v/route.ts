import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { verifyUser } from "@/utils/verifyUserAuth";

export async function GET(
  req: NextRequest
) {
  try {
    const userId = await verifyUser();
    if (userId instanceof NextResponse) {
      return userId;} 
    return NextResponse.json({ message: "Registro obtido", userId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro Auth-V" }, { status: 500 });
  }
}

