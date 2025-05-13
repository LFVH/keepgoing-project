import { AuthOptions } from "next-auth"
import prisma from "@/database/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';
import dayjs from "dayjs"

const AuthHandler :AuthOptions= {
  pages: {
    error: "/",
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas.");
        }
      
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });
      
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }
      
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Senha incorreta.");
        }
        
        return { id: user.id, name: user.name, email: user.email }; // Retorna os dados do usuário autenticado
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Criando um refresh token no login
        const expiresIn = dayjs().add(7, "days").unix();
        await prisma.refreshToken.upsert({
          where: { userId: user.id },
          create: { userId: user.id, expiresIn },
          update: { expiresIn },
        });
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
      return token;
    },

    session({ session, token }) {
      
      session = token.user as any
      return Promise.resolve(session)
    },
  },
}
export default AuthHandler