import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { processImageUpload } from "@/features/projects/model/uploadService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(10, 60000, "upload_image");
    if (rateLimitResponse) return rateLimitResponse;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "File gambar wajib ada" }, { status: 400 });

    const secureUrl = await processImageUpload(file);
    return NextResponse.json({ secure_url: secureUrl });
  } catch (error: unknown) {
    if (getErrorMessage(error) === "INVALID_FILE_TYPE") return NextResponse.json({ error: "File yang diunggah harus berupa gambar" }, { status: 400 });
    if (getErrorMessage(error) === "FILE_TOO_LARGE") return NextResponse.json({ error: "Ukuran gambar tidak boleh lebih dari 10MB" }, { status: 400 });
    if (getErrorMessage(error) === "CLOUDINARY_NOT_CONFIGURED") return NextResponse.json({ error: "Konfigurasi server (Cloudinary) belum diatur" }, { status: 500 });
    if (getErrorMessage(error) === "CLOUDINARY_UPLOAD_FAILED") return NextResponse.json({ error: "Layanan CDN sedang sibuk atau gangguan. Silakan coba lagi beberapa saat." }, { status: 503 });
    
    console.error("Upload Image Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat mengunggah gambar" }, { status: 500 });
  }
}
