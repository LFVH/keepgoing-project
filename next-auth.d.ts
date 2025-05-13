import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string; 
    email: string | null;
    name: string | null;
    user: {
      id: string; 
      email: string | null;
      name: string | null;
      image: string | null;
    };
  }
  interface JWT {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
    };
  }
}