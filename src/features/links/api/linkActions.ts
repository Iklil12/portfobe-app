"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { getUserLinks, createNewLink, updateLink, deleteLink } from "@/features/links/model/linkService";

interface ActionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export async function getLinksAction(page: number = 1, limit: number = 20): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const result = await getUserLinks(session.user.email, page, limit);
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function createLinkAction(): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const result = await createNewLink(session.user.email);
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updateLinkAction(
  id: string,
  data: { platform?: string; url?: string; isActive?: boolean }
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const result = await updateLink(id, session.user.id, data);
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function deleteLinkAction(id: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await deleteLink(id, session.user.id);
    return { success: true };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
