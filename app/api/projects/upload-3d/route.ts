import { getErrorMessage } from "@/shared/lib/errorHelper";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/api/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";
import { process3DUpload } from "@/features/projects/model/uploadService";

export async function POST(req: Request) {
  try {
    const rateLimitRes = await checkRateLimit(5, 5 * 60 * 1000, "upload_3d");
    if (rateLimitRes) return rateLimitRes;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !title) return NextResponse.json({ error: "File dan judul wajib diisi" }, { status: 400 });

    const project = await process3DUpload((session.user as any).id, file, title, description);
    return NextResponse.json(project);
  } catch (error: unknown) {
    if (getErrorMessage(error) === "FEATURE_LOCKED") return NextResponse.json({ error: "Upgrade ke PRO untuk mengunggah model 3D." }, { status: 403 });
    if (getErrorMessage(error) === "INVALID_3D_FORMAT") return NextResponse.json({ error: "Hanya format .glb / .gltf yang diizinkan" }, { status: 400 });
    if (getErrorMessage(error) === "FILE_TOO_LARGE") return NextResponse.json({ error: "Ukuran file terlalu besar." }, { status: 400 });
    if (getErrorMessage(error) === "INVALID_3D_CONTENT") return NextResponse.json({ error: "Format file tidak valid. Harap unggah file model 3D GLB atau GLTF yang asli." }, { status: 400 });
    if (getErrorMessage(error) === "BUNNY_NOT_CONFIGURED") return NextResponse.json({ error: "Konfigurasi storage belum diset" }, { status: 500 });
    if (getErrorMessage(error) === "BUNNY_UPLOAD_FAILED") return NextResponse.json({ error: "Gagal mengunggah ke CDN" }, { status: 500 });

    console.error("Upload 3D Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
