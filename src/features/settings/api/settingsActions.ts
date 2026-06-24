"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import {
  getAccountStatus,
  updateAccountStatus,
  deleteUserAccount,
  requestEmailChange,
  updatePassword,
} from "@/features/settings/model/accountService";

interface ActionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export async function getStatusAction(): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const result = await getAccountStatus(session.user.email);
    return { success: true, data: result as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function toggleStatusAction(isLive: boolean): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    const result = await updateAccountStatus(session.user.email, isLive);
    return { success: true, data: result as Record<string, unknown> };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "EMAIL_NOT_VERIFIED") {
      return { success: false, error: "FORBIDDEN" };
    }
    return { success: false, error: message };
  }
}

export async function deleteAccountAction(emailInput: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    await deleteUserAccount(session.user.email, emailInput);
    return { success: true };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updateEmailAction(newEmail: string, password: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    await requestEmailChange(session.user.email, newEmail, password);
    return { success: true };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updatePasswordAction(
  currentPassword: string | null,
  newPassword: string
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, error: "Unauthorized" };

    await updatePassword(session.user.email, currentPassword ?? "", newPassword);
    return { success: true };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
