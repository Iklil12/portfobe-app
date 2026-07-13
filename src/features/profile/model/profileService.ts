import { Prisma } from '@prisma/client';
import prisma from '@/shared/lib/prisma';
import { isForbiddenUsername } from '@/shared/constants/reserved-usernames';
import { redis } from '@/shared/lib/redis';

export async function getFullProfile(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      plan: true,
      isLive: true,
      profile: true,
      siteAppearance: true,
      integrations: true,
      lastUsernameChange: true
    } 
  });

  if (!user) throw new Error("USER_NOT_FOUND");

  return {
    ...user,
    ...user.profile,
    plan: user.plan
  };
}


export interface ProfileUpdateDTO {
  subdomain?: string;
  fullName?: string;
  profession?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  hasCompletedDashboardTour?: boolean;
  hasCompletedAppearanceTour?: boolean;
  [key: string]: string | boolean | undefined;
}

export async function checkSubdomainAvailability(subdomain: string) {
  if (!subdomain) throw new Error("MISSING_DATA");

  const check = isForbiddenUsername(subdomain);
  if (check.forbidden) {
    throw new Error(`FORBIDDEN_NAME:${check.reason}`);
  }

  const existingCount = await prisma.profile.count({
    where: { subdomain: subdomain.toLowerCase() }
  });

  return existingCount === 0;
}

export async function updateProfileFull(email: string, data: ProfileUpdateDTO) {
  const { subdomain, fullName, profession } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true, email: true }
  });

  if (!user) throw new Error("USER_NOT_FOUND");

  if (subdomain) {
    if (subdomain.length < 3 || subdomain.length > 15) {
      throw new Error("INVALID_SUBDOMAIN_LENGTH");
    }

    const check = isForbiddenUsername(subdomain);
    if (check.forbidden) {
      throw new Error(`FORBIDDEN_NAME:${check.reason}`);
    }
    
    const existingProfile = await prisma.profile.findUnique({
      where: { subdomain: subdomain.toLowerCase() },
      select: { userId: true }
    });

    if (existingProfile && existingProfile.userId !== user.id) {
      throw new Error("SUBDOMAIN_TAKEN");
    }
  }

  const updatedProfile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      ...(subdomain !== undefined && { subdomain: subdomain.toLowerCase() }),
      ...(fullName !== undefined && { fullName }),
      ...(profession !== undefined && { profession })
    },
    create: {
      userId: user.id,
      fullName: fullName || "Creator",
      subdomain: subdomain ? subdomain.toLowerCase() : null,
      profession: profession || null
    }
  });

  // Pemicu Webhook n8n (Asynchronous)
  const loginType = user.password === 'GOOGLE_LOGIN_NO_PASSWORD' ? 'Google Auth' : 'Email/Password';
  fetch("https://n8n.portfo.be/webhook/0b096974-e914-473e-95de-3fa994929c9f", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET || "",
    },
    body: JSON.stringify({
      fullName: updatedProfile.fullName,
      email: user.email,
      loginType: loginType,
      subdomain: updatedProfile.subdomain,
    })
  }).catch(err => {
    console.error("Gagal mengirim webhook ke n8n:", err);
  });

  // Hapus cache dashboard SWR karena subdomain/profil berubah
  await redis.del(`dashboard:sync:${user.id}:7d`);
  await redis.del(`dashboard:sync:${user.id}:30d`);
  await redis.del(`dashboard:sync:${user.id}:1d`);
  await redis.del(`dashboard:sync:${user.id}:all`);

  return updatedProfile;
}

export async function patchProfilePartial(email: string, data: ProfileUpdateDTO) {
  const allowedFields = ['fullName', 'profession', 'bio', 'subdomain', 'location', 'hasCompletedDashboardTour', 'hasCompletedAppearanceTour'];
  
  const updateData: Record<string, string | boolean | undefined> = {};
  for (const key of Object.keys(data)) {
    if (allowedFields.includes(key)) {
      updateData[key] = data[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("MISSING_DATA");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (!user) throw new Error("USER_NOT_FOUND");

  const updatedProfile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: updateData,
    create: {
      userId: user.id,
      fullName: (updateData.fullName as string) || "Creator",
      subdomain: (updateData.subdomain as string) || null,
      profession: (updateData.profession as string) || null,
      bio: (updateData.bio as string) || null
    }
  });

  // Hapus cache dashboard SWR karena sebagian profil berubah
  await redis.del(`dashboard:sync:${user.id}:7d`);
  await redis.del(`dashboard:sync:${user.id}:30d`);
  await redis.del(`dashboard:sync:${user.id}:1d`);
  await redis.del(`dashboard:sync:${user.id}:all`);

  return updatedProfile;
}

export async function updateProfileAvatarAndBio(email: string, data: ProfileUpdateDTO) {
  const { isForbiddenUsername } = await import("@/shared/constants/reserved-usernames");
  const sanitizeHtml = (await import("sanitize-html")).default;
  const { logActivity } = await import("@/shared/lib/activity");
  const { invalidatePortfolioCache, redis } = await import("@/shared/lib/redis");

  let { firstName, lastName, subdomain, profession, bio, avatar } = data; 
  
  if (avatar && !avatar.startsWith("https://res.cloudinary.com/") && !avatar.startsWith("https://ui-avatars.com/")) {
    throw new Error("INVALID_AVATAR");
  }

  const sanitizeConfig = { allowedTags: [], allowedAttributes: {} };
  firstName = sanitizeHtml(firstName || "", sanitizeConfig).trim();
  lastName = sanitizeHtml(lastName || "", sanitizeConfig).trim();
  profession = sanitizeHtml(profession || "", sanitizeConfig).trim();
  bio = sanitizeHtml(bio || "", sanitizeConfig).trim();

  const currentUser = await prisma.user.findUnique({
    where: { email },
    include: { profile: true, siteAppearance: true }
  });

  if (!currentUser) throw new Error("USER_NOT_FOUND");

  if (subdomain && subdomain !== currentUser.profile?.subdomain) {
    if (currentUser.lastUsernameChange) {
      const lastChange = new Date(currentUser.lastUsernameChange);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastChange.getTime());
      if (diffTime < 14 * 24 * 60 * 60 * 1000) {
        throw new Error("SUBDOMAIN_COOLDOWN");
      }
    }

    const forbiddenCheck = isForbiddenUsername(subdomain);
    if (forbiddenCheck.forbidden) {
      throw new Error(`FORBIDDEN_NAME:${forbiddenCheck.reason}`);
    }

    const existingSubdomain = await prisma.profile.findUnique({
      where: { subdomain: subdomain }
    });
    
    if (existingSubdomain && existingSubdomain.userId !== currentUser.id) {
      throw new Error("SUBDOMAIN_TAKEN");
    }
  }

  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "New User";

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      avatar: avatar,
      ...(subdomain && subdomain !== currentUser.profile?.subdomain && {
        lastUsernameChange: new Date()
      }),
      profile: {
        upsert: {
          create: { fullName, subdomain, profession, bio, avatarUrl: avatar },
          update: { fullName, subdomain, profession, bio, avatarUrl: avatar }
        }
      }
    },
    include: { profile: true, siteAppearance: true } 
  });

  const currentAvatar = currentUser.avatar;
  const currentSubdomain = currentUser.profile?.subdomain;

  if (avatar !== currentAvatar) {
    if (!avatar || avatar === "") await logActivity(currentUser.id, "DELETE_AVATAR", "Deleted main profile photo");
    else await logActivity(currentUser.id, "UPDATE_AVATAR", "Changed main profile photo");
  }

  if (subdomain !== currentSubdomain) {
    await logActivity(currentUser.id, "UPDATE_PROFILE", `Changed custom subdomain to "${subdomain}"`);
  }

  if (avatar === currentAvatar && subdomain === currentSubdomain) {
      await logActivity(currentUser.id, "UPDATE_PROFILE", "Updated bio and profile information");
  }

  if (currentSubdomain && subdomain !== currentSubdomain) {
    await redis.del(`portfolio_db:${currentSubdomain.toLowerCase().trim()}`);
  }
  await invalidatePortfolioCache(currentUser.id);

  return updatedUser;
}
