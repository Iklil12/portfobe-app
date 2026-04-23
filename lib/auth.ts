import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Tanpa PrismaAdapter, karena kita tangani sendiri agar cocok dengan schema
  
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
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

        // Pastikan user ada, dan jika dia login Google tapi mencoba manual, passwordnya bukan "GOOGLE_LOGIN_NO_PASSWORD"
        if (!user || !user.password || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
            throw new Error("Email tidak ditemukan atau gunakan Login Google.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Password salah.");

        return {
          id: user.id,
          name: user.profile?.fullName || "User",
          email: user.email,
          image: user.profile?.avatarUrl || user.avatar, 
          avatar: user.avatar, 
          plan: user.plan, 
          profession: user.profile?.profession,
          bio: user.profile?.bio,
        };
      }
    })
  ],

  callbacks: {
    // 1. SIGN IN CALLBACK: Di sinilah Auto-Register Google Terjadi
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true } // Tarik sekalian profilnya
          });

          // JIKA USER GOOGLE BELUM PERNAH DAFTAR SAMA SEKALI
          if (!existingUser) {
            // Karena schema mewajibkan password, kita kasih string penanda khusus
            // Kita juga sekalian buatkan tabel Profile-nya!
            await prisma.user.create({
              data: {
                email: user.email,
                password: "GOOGLE_LOGIN_NO_PASSWORD", // Wajib diisi menurut Schema
                avatar: user.image || "", // Wajib diisi menurut Schema
                profile: {
                    create: {
                        fullName: user.name || "Pengguna Baru", // Masukkan nama Google ke Profile
                        avatarUrl: user.image || "",
                    }
                }
              },
            });
          } else {
             // Jika User sudah ada, tapi belum punya tabel Profile
             if (!existingUser.profile) {
                 await prisma.profile.create({
                     data: {
                         userId: existingUser.id,
                         fullName: user.name || "Pengguna Setia",
                         avatarUrl: user.image || "",
                     }
                 });
             }
          }
          return true; // Izinkan masuk!
        } catch (error) {
          console.error("Gagal Auto-Register Google:", error);
          return false;
        }
      }
      return true; // Izinkan login manual
    },

    // 2. JWT CALLBACK: Update & Pasokan Data
    async jwt({ token, user, trigger, session, account }: any) {
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.picture = session.user.image; 
        token.avatar = session.user.avatar; 
        token.profession = session.user.profession;
        token.bio = session.user.bio;
      }
      
      // Ambil data terbaru dari Database setiap kali login
      if (user || account?.provider === "google") {
        const emailToFind = user?.email || token.email;
        if (emailToFind) {
          const dbUser = await prisma.user.findUnique({
            where: { email: emailToFind },
            include: { profile: true }
          });
          
          if (dbUser) {
            token.id = dbUser.id; 
            token.name = dbUser.profile?.fullName || "User";
            token.email = dbUser.email;
            token.plan = dbUser.plan;
            token.profession = dbUser.profile?.profession;
            token.bio = dbUser.profile?.bio;
            token.avatar = dbUser.avatar; 
            token.picture = dbUser.profile?.avatarUrl || dbUser.avatar || user?.image;
          }
        }
      }
      return token;
    },
    
    // 3. SESSION CALLBACK: Oper Karcis ke Frontend
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string; 
        session.user.plan = token.plan; 
        session.user.profession = token.profession;
        session.user.bio = token.bio;
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