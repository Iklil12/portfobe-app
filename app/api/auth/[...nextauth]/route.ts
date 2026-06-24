import NextAuth from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
export { authOptions }; // Re-export agar import lama tidak patah
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };