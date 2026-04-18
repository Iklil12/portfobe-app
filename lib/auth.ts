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

        // RETURN KE BAWAH SAAT LOGIN BERHASIL
        return {
          id: user.id,
          name: user.profile?.fullName || "User",
          email: user.email,
          
          // PENTING: Bawa avatar dari tabel User
          image: user.avatar, 
          avatar: user.avatar, 
          
          // PENTING: Bawa data lainnya
          plan: user.plan, 
          profession: user.profile?.profession,
          bio: user.profile?.bio,
        };
      }
    })
  ],
  callbacks: {
    // 1. JWT mengatur apa yang disimpan di dalam "Karcis" / Token
    async jwt({ token, user, trigger, session }: any) {
      
      // JIKA ADA TRIGGER UPDATE DARI FRONTEND (Saat klik Simpan Profil)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.picture = session.user.image; // standar bawaan NextAuth untuk gambar
        token.avatar = session.user.avatar; // custom punya Anda
        token.profession = session.user.profession;
        token.bio = session.user.bio;
      }
      
      // JIKA USER BARU PERTAMA KALI LOGIN
      if (user) {
        token.plan = user.plan; 
        token.profession = user.profession;
        token.bio = user.bio;
        token.avatar = user.avatar;
        token.picture = user.avatar;
      }
      return token;
    },
    
    // 2. SESSION mengatur apa yang bisa dibaca oleh halaman Frontend (useSession)
    async session({ session, token }: any) {
      if (session.user) {
        session.user.plan = token.plan; 
        session.user.profession = token.profession;
        session.user.bio = token.bio;
        
        // Pastikan frontend bisa membaca foto barunya
        session.user.avatar = token.avatar;
        session.user.image = token.picture;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" }
};