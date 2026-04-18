import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- Ambil pengaturan dari folder lib

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };