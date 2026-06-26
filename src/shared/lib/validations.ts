import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  subdomain: z.string().min(3).max(15).regex(/^[a-z0-9-]+$/).optional(),
  fullName: z.string().max(50).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  profession: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional(),
  avatar: z.string().url().optional(),
  hasCompletedDashboardTour: z.boolean().optional(),
  hasCompletedAppearanceTour: z.boolean().optional(),
}).catchall(z.any());

export const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(2000).optional(),
  mediaUrl: z.string().min(1, "Media URL is required"),
  projectType: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).transform(val => Array.isArray(val) ? JSON.stringify(val) : val).optional(),
  
  // Certificate specific
  issuer: z.string().max(100).optional(),
  year: z.coerce.string().optional(),
  status: z.string().max(100).optional(),
}).catchall(z.any());

export const LinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1),
  url: z.string().min(1),
  isActive: z.boolean().optional(),
  order: z.number().int().optional()
}).catchall(z.any());

export const LinksReorderSchema = z.object({
  links: z.array(z.object({
    id: z.string(),
    order: z.number().int()
  }))
});

export const ThemeSelectionSchema = z.object({
  themeId: z.string().min(1)
});

export const TrashRestoreSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['project', 'certificate'])
});
