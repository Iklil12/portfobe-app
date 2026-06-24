"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import {
  getAdminNotes,
  createAdminNote,
  updateAdminNote,
  deleteAdminNote,
} from "@/features/admin/model/adminService";

interface ActionResult {
  success: boolean;
  data?: Record<string, unknown> | Record<string, unknown>[];
  error?: string;
}

export async function getNotesAction(type: string | null = null): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const result = await getAdminNotes(session.user.id, type);
    return { success: true, data: result as unknown as Record<string, unknown>[] };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function createNoteAction(content: string, type: string | null = null): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const result = await createAdminNote(session.user.id, content, type);
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updateNoteAction(
  noteId: string,
  isCompleted?: boolean,
  content?: string
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const result = await updateAdminNote(session.user.id, noteId, isCompleted, content);
    return { success: true, data: result as unknown as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function deleteNoteAction(noteId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await deleteAdminNote(session.user.id, noteId);
    return { success: true };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
