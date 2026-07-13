import { sendSupportEmail } from "@/shared/lib/mail";
import { checkRateLimit } from "@/shared/lib/rate-limit";

export async function submitSupportRequest(name: string, email: string, message: string) {
  const rateLimitRes = await checkRateLimit(5, 60 * 60 * 1000);
  if (rateLimitRes) {
    throw new Error("429:Too many messages sent. Please try again in 1 hour.");
  }

  if (!name || !email || !message) {
    throw new Error("400:Please fill in all fields.");
  }

  const result = await sendSupportEmail(name, email, message);

  if (result.success) {
    return { message: "Message sent successfully. We will contact you shortly." };
  } else {
    throw new Error("500:Failed to send message. Please try again later.");
  }
}
