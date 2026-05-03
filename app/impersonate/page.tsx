"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ImpersonatePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // key dikirim via POST secara tertutup melalui NextAuth
    const result = await signIn("credentials", {
      email,
      password: key, // Pastikan logika di backend NextAuth membaca ini sebagai request impersonate
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      alert("Akses Ditolak!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form onSubmit={handleImpersonate} className="bg-zinc-900 p-8 rounded-xl flex flex-col gap-4 w-96">
        <h1 className="text-xl font-bold">Admin Override</h1>
        
        <input 
          type="email" 
          placeholder="Email Target" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white"
          required
        />
        
        <input 
          type="password" 
          placeholder="Superadmin Key" 
          value={key} 
          onChange={(e) => setKey(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white"
          required
        />
        
        <button type="submit" disabled={isLoading} className="bg-indigo-600 p-3 rounded font-bold hover:bg-indigo-500">
          {isLoading ? "Mengautentikasi..." : "Akses Akun"}
        </button>
      </form>
    </div>
  );
}