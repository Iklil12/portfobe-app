import { sendSupportEmail } from "@/shared/lib/mail";
import { checkRateLimit } from "@/shared/lib/rate-limit";

export async function submitSupportRequest(name: string, email: string, message: string) {
  const rateLimitRes = await checkRateLimit(5, 60 * 60 * 1000);
  if (rateLimitRes) {
    throw new Error("429:Terlalu banyak pesan terkirim. Silakan coba lagi dalam 1 jam.");
  }

  if (!name || !email || !message) {
    throw new Error("400:Mohon lengkapi semua field.");
  }

  const result = await sendSupportEmail(name, email, message);

  if (result.success) {
    return { message: "Message sent successfully. We will contact you shortly." };
  } else {
    throw new Error("500:Failed to send message. Please try again later.");
  }
}
