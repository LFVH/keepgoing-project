import { AuthOptions } from "next-auth"
import prisma from "@/database/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';
import dayjs from "dayjs"
import { logNow } from "@/utils/Logging";

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
        if (user.isBlocked) {
          throw new Error("Código 101");
        }
      
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Senha incorreta.");
        }
        return { id: user.id, name: user.name, email: user.email , status: user.statusAss}; // Retorna os dados do usuário autenticado
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
          name: user.name || null,
          status: user.status || null,
        };
      }
      return token;
    },

  async session({ session, token }) {
    if (token.user) {
      // Mantém todos os dados originais da session e adiciona/atualiza os campos
      session.user = {
        ...session.user, // mantém os campos padrão (name, email, image)
        ...token.user,   // adiciona os campos do token (id, status, etc)
      };
      
      // Se você quer o status também no nível superior da session
      session.status = token.user.status;
      session.id = token.user.id;
    }
    return session;
  },
  },
}


export default AuthHandler