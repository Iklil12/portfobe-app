import { Metadata } from "next";
import { UnauthorizedUI } from "@/components/errors/UnauthorizedUI";

export const metadata: Metadata = {
  title: "Unauthorized - Portfobe",
  description: "Akses ditolak ke halaman ini.",
};

export default function UnauthorizedPage() {
  return <UnauthorizedUI />;
}
