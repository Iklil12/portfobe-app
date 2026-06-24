"use server";

import { submitSupportRequest } from "@/features/support/model/supportService";

interface ActionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export async function sendSupportAction(
  name: string,
  email: string,
  message: string
): Promise<ActionResult> {
  try {
    const result = await submitSupportRequest(name, email, message);
    return { success: true, data: result as Record<string, unknown> };
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
