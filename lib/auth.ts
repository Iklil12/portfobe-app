import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // <-- TAMBAHAN GOOGLE
import { PrismaAdapter } from "@auth/prisma-adapter"; // <-- TAMBAHAN ADAPTER
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // --- 1. KONFIGURASI ADAPTER & SESSION ---
  adapter: PrismaAdapter(prisma), // Simpan akun Google otomatis ke Database
  session: {
    strategy: "jwt", // Wajib "jwt" jika menggabungkan Credentials & PrismaAdapter
  },

  providers: [
    // --- 2. LOGIN GOOGLE ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true, // Membantu jika user login manual lalu login Google dengan email yang sama
    }),

    // --- 3. LOGIN MANUAL (TIDAK DIUBAH) ---
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
          name: user.profile?.fullName || user.name || "User",
          email: user.email,
          
          // PENTING: Bawa avatar dari tabel User (atau image bawaan DB)
          image: user.avatar || user.image, 
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
    async jwt({ token, user, trigger, session, account }: any) {
      
      // JIKA ADA TRIGGER UPDATE DARI FRONTEND (Saat klik Simpan Profil)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.picture = session.user.image; // standar bawaan NextAuth untuk gambar
        token.avatar = session.user.avatar; // custom punya Anda
        token.profession = session.user.profession;
        token.bio = session.user.bio;
      }
      
      // JIKA USER BARU PERTAMA KALI LOGIN / JWT DIBUAT
      if (user) {
        token.id = user.id; // Pastikan ID selalu masuk

        if (account?.provider === "google") {
          // --- FIX CERDAS ---
          // Jika login via Google, ambil data custom (plan, profession) dari DB 
          // karena payload bawaan Google tidak memiliki data tersebut.
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true }
          });
          
          if (dbUser) {
            token.plan = dbUser.plan; 
            token.profession = dbUser.profile?.profession;
            token.bio = dbUser.profile?.bio;
            token.avatar = dbUser.avatar || user.image; // Pakai foto Google jika avatar kosong
            token.picture = dbUser.avatar || user.image;
          }
        } else {
          // --- JIKA LOGIN MANUAL (Credentials) ---
          token.plan = user.plan; 
          token.profession = user.profession;
          token.bio = user.bio;
          token.avatar = user.avatar;
          token.picture = user.avatar;
        }
      }
      return token;
    },
    
    // 2. SESSION mengatur apa yang bisa dibaca oleh halaman Frontend (useSession)
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id; // Sangat penting agar Frontend tahu ID user!
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
  pages: { 
    signIn: "/login",
    error: "/login" 
  }
};