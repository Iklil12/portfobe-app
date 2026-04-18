import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true }
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.profile?.fullName || "User",
          email: user.email,
          
          // PENTING: Ambil data plan dari database dan masukkan ke object yang akan di-return
          plan: user.plan, 
          profession: user.profile?.profession,
          bio: user.profile?.bio,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // PENTING: Masukkan plan dari user ke token
        token.plan = user.plan; 
        token.profession = user.profession;
        token.bio = user.bio;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        // PENTING: Masukkan plan dari token ke session akhir
        session.user.plan = token.plan; 
        session.user.profession = token.profession;
        session.user.bio = token.bio;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" }
};