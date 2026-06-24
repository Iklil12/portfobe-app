"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { getTrashItems, processTrashAction } from "@/features/trash/model/trashService";

interface ActionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export async function getTrashAction(page: number, limit: number): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const result = await getTrashItems(session.user.email, String(page), String(limit));
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function trashAction(
  action: string,
  id?: string,
  type?: string
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const result = await processTrashAction(session.user.email, action, id ?? "", type ?? "");
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    // Parse "STATUS:message" pattern
    if (message.includes(":")) {
      const parts = message.split(":");
      return { success: false, error: parts.slice(1).join(":") };
    }
    return { success: false, error: message };
  }
}
