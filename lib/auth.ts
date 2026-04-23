import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Tanpa PrismaAdapter, karena kita tangani sendiri agar cocok dengan schema database kita
  
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

        if (!user || !user.password || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
            throw new Error("Email tidak ditemukan atau gunakan Login Google.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Password salah.");

        const userData = user as any;

        return {
          id: userData.id,
          name: user.profile?.fullName || userData.name || "User",
          email: userData.email,
          image: user.profile?.avatarUrl || userData.avatar || userData.image, 
          avatar: userData.avatar, 
          plan: userData.plan, 
          profession: user.profile?.profession,
          bio: user.profile?.bio,
          subdomain: user.profile?.subdomain,
          isLive: userData.isLive
        };
      }
    })
  ],

  callbacks: {
    // 0. REDIRECT CALLBACK: Mengatasi masalah "Harus klik login Google 2 kali"
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl + "/dashboard";
    },

    // 1. SIGN IN CALLBACK: Di sinilah Auto-Register & Pengisian Tabel Account Terjadi
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true } 
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                password: "GOOGLE_LOGIN_NO_PASSWORD", 
                avatar: user.image || "", 
                
                profile: {
                    create: {
                        fullName: user.name || "Pengguna Baru", 
                        avatarUrl: user.image || "",
                    }
                },
                
                accounts: {
                    create: {
                        type: account.type,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        access_token: account.access_token,
                        id_token: account.id_token,
                    }
                }
              },
            });
          } else {
             if (!existingUser.profile) {
                 await prisma.profile.create({
                     data: {
                         userId: existingUser.id,
                         fullName: user.name || "Pengguna Setia",
                         avatarUrl: user.image || "",
                     }
                 });
             }
             
             const existingAccount = await prisma.account.findFirst({
                 where: { provider: account.provider, providerAccountId: account.providerAccountId }
             });
             
             if (!existingAccount) {
                 await prisma.account.create({
                     data: {
                         userId: existingUser.id,
                         type: account.type,
                         provider: account.provider,
                         providerAccountId: account.providerAccountId,
                         access_token: account.access_token,
                         id_token: account.id_token,
                     }
                 });
             }
          }
          return true; 
        } catch (error) {
          console.error("Gagal Auto-Register Google:", error);
          return false; 
        }
      }
      return true; 
    },

    // 2. JWT CALLBACK: SINKRONISASI DATABASE 100% AKURAT
    async jwt({ token, user, trigger, session, account }: any) {
      
      // LOGIKA BARU: Jika Frontend bilang "update", panggil ulang data dari Database!
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          include: { profile: true }
        });
        
        if (dbUser) {
          const uData = dbUser as any;
          token.name = dbUser.profile?.fullName || uData.name || "User";
          token.profession = dbUser.profile?.profession;
          token.bio = dbUser.profile?.bio;
          token.subdomain = dbUser.profile?.subdomain; // Sinkronisasi Subdomain!
          token.isLive = uData.isLive;
          token.avatar = uData.avatar;
          token.picture = dbUser.profile?.avatarUrl || uData.avatar || token.picture;
        }
      }
      
      // Ambil data terbaru saat login pertama kali
      if (user || account?.provider === "google") {
        const emailToFind = user?.email || token.email;
        if (emailToFind) {
          const dbUser = await prisma.user.findUnique({
            where: { email: emailToFind },
            include: { profile: true }
          });
          
          if (dbUser) {
            const uData = dbUser as any; 
            
            token.id = uData.id; 
            token.name = dbUser.profile?.fullName || uData.name || "User";
            token.email = uData.email;
            token.plan = uData.plan;
            token.profession = dbUser.profile?.profession;
            token.bio = dbUser.profile?.bio;
            token.avatar = uData.avatar; 
            token.picture = dbUser.profile?.avatarUrl || uData.avatar || user?.image;
            
            token.subdomain = dbUser.profile?.subdomain;
            token.isLive = uData.isLive;
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
        
        session.user.subdomain = token.subdomain;
        session.user.isLive = token.isLive;
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