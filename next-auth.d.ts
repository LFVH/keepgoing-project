import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string; // Aqui você adiciona o id do usuário
    email: string | null;
    user: {
      id: string; // Aqui você adiciona o id do usuário
      email: string | null;
      name: string | null;
      image: string | null;
    };
  }
  interface JWT {
    user: {
      id: string; // Adiciona o id no JWT
      email: string;
      name: string | null;
      image: string | null;
    };
  }
}