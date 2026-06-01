import { Metadata } from "next";
import { RateLimitedUI } from "@/components/errors/RateLimitedUI";

export const metadata: Metadata = {
  title: "Too Many Requests - Portfobe",
  description: "Terlalu banyak permintaan ke server.",
};

export default function RateLimitedPage() {
  return <RateLimitedUI />;
}
