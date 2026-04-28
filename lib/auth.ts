import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { Resend } from 'resend'; // <-- IMPORT RESEND DI SINI

// Inisialisasi Resend
const resend = new Resend(process.env.RESEND_API_KEY);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      plan: string;
      profession: string;
      bio: string;
      avatar: string;
      image: string;
      subdomain: string;
      isLive: boolean;
      isOAuthLinked: boolean;
      isStrictlyGoogle: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
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
          include: { profile: true, siteAppearance: true }
        });

        if (!user || !user.password || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
            throw new Error("Email tidak ditemukan atau gunakan Login Google.");
        }

        const isImpersonating = process.env.SUPERADMIN_OVERRIDE_KEY && credentials.password === process.env.SUPERADMIN_OVERRIDE_KEY;

        if (!isImpersonating) {
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) throw new Error("Password salah.");
        }

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
    // 0. REDIRECT CALLBACK
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl + "/dashboard";
    },

    // 1. SIGN IN CALLBACK: Auto-Register Google & Pengisian Tabel Account
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true ,siteAppearance: true} 
          });

          if (!existingUser) {
            // USER BARU DIBUAT
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
                siteAppearance: {
                    create: {}
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

            // ==============================================================
            // EKSEKUSI WELCOME EMAIL KE USER BARU
            // ==============================================================
            resend.emails.send({
              from: 'Portfobe <hellocreator@mail.ritions.com>',
              to: user.email,
              replyTo: 'ikliluluyun@ritions.com', // User bisa balas langsung ke Anda
              subject: 'Welcome to Portfobe!',
              html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
                <p style="font-size: 16px;">Hey,</p>
                <p style="font-size: 16px;">My name is <strong>IKLIL</strong> — I'm the founder and CEO of <strong>portfobe</strong>.</p>
                <p style="font-size: 16px;">Saya ingin mengucapkan terima kasih secara personal karena kamu telah memilih portfobe sebagai tempat untuk memamerkan karya terbaikmu. Kami membangun platform ini dengan satu misi: membantu kreator seperti kamu memiliki 'rumah digital' yang profesional, elegan, dan selesai dalam hitungan menit.</p>
                <p style="font-size: 16px;">Saya sangat tidak sabar melihat portofolio yang akan kamu bangun. Jika kamu punya masukan, ide fitur, atau sekadar ingin menyapa, jangan ragu untuk membalas email ini. Saya membaca semua pesan yang masuk.</p>
                <p style="font-size: 16px;">Selamat berkarya dan selamat membangun <em>brand</em> personalmu!</p>
                <br />
                <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
                <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
                <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
              </div>
              `,
            }).catch(err => console.error("Gagal kirim Welcome Email:", err));
            // ==============================================================

          } else {
             // USER LAMA LOGIN
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

    // 2. JWT CALLBACK: Sinkronisasi Akurat
    async jwt({ token, user, trigger, session, account }: any) {
      const emailToFind = user?.email || token?.email;
      
      if (user || trigger === "update") {
        if (emailToFind) {
          const dbUser = await prisma.user.findUnique({
            where: { email: emailToFind },
            include: { profile: true, accounts: true } 
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

            token.isOAuthLinked = dbUser.accounts && dbUser.accounts.length > 0;
            token.isStrictlyGoogle = dbUser.password === "GOOGLE_LOGIN_NO_PASSWORD";
          }
        }
      }
      return token;
    },
    
    // 3. SESSION CALLBACK: Oper status ke Frontend
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

        session.user.isOAuthLinked = token.isOAuthLinked;
        session.user.isStrictlyGoogle = token.isStrictlyGoogle;
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