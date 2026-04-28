"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

function ImpersonateLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const email = searchParams.get("email");
    const key = searchParams.get("key");

    if (!email || !key) {
      router.push("/login");
      return;
    }

    // Auto-login via NextAuth credentials
    signIn("credentials", {
      email,
      password: key,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-bold">Mengautentikasi Sesi Superadmin...</h1>
      <p className="text-zinc-500 mt-2">Anda sedang login sebagai pengguna. Harap tunggu...</p>
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Memuat...</div>}>
      <ImpersonateLogic />
    </Suspense>
  );
}
