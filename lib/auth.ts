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

        // Pastikan user ada, dan cegah login manual jika dia pakai akun Google
        if (!user || !user.password || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
            throw new Error("Email tidak ditemukan atau gunakan Login Google.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Password salah.");

        // --- BYPASS TYPESCRIPT ---
        // Agar TS tidak protes saat kita mencoba mencari property name atau image
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
        };
      }
    })
  ],

  callbacks: {
    // 1. SIGN IN CALLBACK: Di sinilah Auto-Register & Pengisian Tabel Account Terjadi
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true } // Tarik sekalian profilnya
          });

          // JIKA USER GOOGLE BELUM PERNAH DAFTAR SAMA SEKALI
          if (!existingUser) {
            // Kita buatkan tabel User, Profile, DAN Account sekaligus!
            await prisma.user.create({
              data: {
                email: user.email,
                password: "GOOGLE_LOGIN_NO_PASSWORD", // Wajib diisi menurut Schema
                avatar: user.image || "", // Wajib diisi menurut Schema
                
                // Buat Profil
                profile: {
                    create: {
                        fullName: user.name || "Pengguna Baru", 
                        avatarUrl: user.image || "",
                    }
                },
                
                // Buat Account (Penghubung ke Google)
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
             // JIKA USER SUDAH ADA (misal daftar manual sebelumnya)
             
             // 1. Cek apakah tabel Profile-nya sudah ada
             if (!existingUser.profile) {
                 await prisma.profile.create({
                     data: {
                         userId: existingUser.id,
                         fullName: user.name || "Pengguna Setia",
                         avatarUrl: user.image || "",
                     }
                 });
             }
             
             // 2. Cek apakah tabel Account-nya sudah ditautkan
             const existingAccount = await prisma.account.findFirst({
                 where: { provider: account.provider, providerAccountId: account.providerAccountId }
             });
             
             if (!existingAccount) {
                 // Tautkan akun Google ini ke User yang sudah ada
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
          return true; // Izinkan masuk!
        } catch (error) {
          console.error("Gagal Auto-Register Google:", error);
          return false; // Tolak login jika database bermasalah
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
            const uData = dbUser as any; // Bypass TS
            
            token.id = uData.id; 
            token.name = dbUser.profile?.fullName || uData.name || "User";
            token.email = uData.email;
            token.plan = uData.plan;
            token.profession = dbUser.profile?.profession;
            token.bio = dbUser.profile?.bio;
            token.avatar = uData.avatar; 
            token.picture = dbUser.profile?.avatarUrl || uData.avatar || user?.image;
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