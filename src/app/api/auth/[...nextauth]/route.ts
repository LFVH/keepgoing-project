import AuthHandler from "@/app/api/login/nextAuthHandler"
import NextAuth from "next-auth"

const handler = NextAuth(AuthHandler)
export { handler as GET, handler as POST }