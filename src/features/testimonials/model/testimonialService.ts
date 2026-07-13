import prisma from '@/shared/lib/prisma';
import { logActivity } from '@/shared/lib/activity';
import { invalidatePortfolioCache } from '@/shared/lib/redis';
import { getEffectivePlan } from '@/features/billing';


export interface TestimonialDTO {
  id?: string;
  clientName?: string;
  clientTitle?: string;
  clientCompany?: string;
  clientAvatar?: string;
  content?: string;
  rating?: number;
  [key: string]: unknown;
}
export async function getTestimonials(email: string) {
  const testimonials = await prisma.testimonial.findMany({
    where: { user: { email } },
    orderBy: { order: 'asc' },
  });
  return testimonials;
}

export async function createTestimonial(email: string, data: any) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (getEffectivePlan(user) === 'FREE') {
    const testimonialCount = await prisma.testimonial.count({ where: { userId: user.id } });
    if (testimonialCount >= 2) throw new Error("QUOTA_EXCEEDED:FREE plan allows maximum 2 testimonials. Please upgrade to PRO.");
  }

  const sanitizeHtml = (await import('sanitize-html')).default;
  let { clientName, company, content, rating, avatarUrl } = data;

  if (!clientName || !content) throw new Error("INVALID_DATA:Name and testimonial content are required");

  if (avatarUrl && !avatarUrl.startsWith('https://res.cloudinary.com/') && !avatarUrl.startsWith('https://ui-avatars.com/')) {
    throw new Error("INVALID_AVATAR:Invalid or untrusted image URL");
  }

  const sanitizeConfig = { allowedTags: [], allowedAttributes: {} };
  clientName = sanitizeHtml(clientName || "", sanitizeConfig).trim();
  company = sanitizeHtml(company || "", sanitizeConfig).trim();
  content = sanitizeHtml(content || "", sanitizeConfig).trim();

  const newTestimonial = await prisma.testimonial.create({
    data: {
      userId: user.id,
      clientName,
      company: company || null,
      content,
      rating: rating ? parseInt(rating) : 5,
      avatarUrl: avatarUrl || null,
      isVisible: true,
      order: 0
    }
  });

  await logActivity(user.id, "ADD_TESTIMONIAL", `Added testimonial from ${clientName}`);
  await invalidatePortfolioCache(user.id);

  return newTestimonial;
}

export async function updateTestimonial(email: string, id: string, data: any) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const existingTestimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!existingTestimonial || existingTestimonial.userId !== user.id) throw new Error("FORBIDDEN:Testimonial not found or access denied");

  const sanitizeHtml = (await import('sanitize-html')).default;
  let { clientName, company, content, rating, avatarUrl, isVisible, order } = data;

  if (avatarUrl && !avatarUrl.startsWith('https://res.cloudinary.com/') && !avatarUrl.startsWith('https://ui-avatars.com/')) {
    throw new Error("INVALID_AVATAR:Invalid or untrusted image URL");
  }

  const sanitizeConfig = { allowedTags: [], allowedAttributes: {} };
  if (clientName !== undefined) clientName = sanitizeHtml(clientName || "", sanitizeConfig).trim();
  if (company !== undefined) company = sanitizeHtml(company || "", sanitizeConfig).trim();
  if (content !== undefined) content = sanitizeHtml(content || "", sanitizeConfig).trim();

  const updatedTestimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      clientName: clientName !== undefined ? clientName : existingTestimonial.clientName,
      company: company !== undefined ? company : existingTestimonial.company,
      content: content !== undefined ? content : existingTestimonial.content,
      rating: rating !== undefined ? parseInt(rating) : existingTestimonial.rating,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : existingTestimonial.avatarUrl,
      isVisible: isVisible !== undefined ? isVisible : existingTestimonial.isVisible,
      order: order !== undefined ? parseInt(order) : existingTestimonial.order,
    }
  });

  await logActivity(user.id, "UPDATE_TESTIMONIAL", `Updated testimonial from ${updatedTestimonial.clientName}`);
  await invalidatePortfolioCache(user.id);

  return updatedTestimonial;
}

export async function deleteTestimonial(email: string, id: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const existingTestimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!existingTestimonial || existingTestimonial.userId !== user.id) throw new Error("FORBIDDEN:Testimonial not found or access denied");

  await prisma.testimonial.delete({ where: { id } });
  await logActivity(user.id, "DELETE_TESTIMONIAL", `Deleted testimonial from ${existingTestimonial.clientName}`);
  await invalidatePortfolioCache(user.id);

  return true;
}

export async function reorderTestimonials(email: string, orderedIds: string[]) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (!orderedIds || !Array.isArray(orderedIds)) throw new Error("INVALID_DATA:Invalid data format");

  const updatePromises = orderedIds.map((id: string, index: number) => {
    return prisma.testimonial.update({
      where: { id, userId: user.id },
      data: { order: index }
    });
  });

  await prisma.$transaction(updatePromises);
  await logActivity(user.id, "REORDER_TESTIMONIALS", "Reordered testimonials");
  await invalidatePortfolioCache(user.id);

  return true;
}
