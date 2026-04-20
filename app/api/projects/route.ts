import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity"; 

// GET: Menarik Semua Proyek untuk ditampilkan di layar
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    // Ambil data dan urutkan dari yang paling baru diupload
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' } 
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error Fetch Projects:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST: Menyimpan Proyek Baru dari Form Popup
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const body = await req.json();
    const { title, description, mediaUrl, projectType } = body;

    // Validasi dari server
    if (!title || !mediaUrl) {
      return NextResponse.json({ error: "Judul dan Media wajib diisi" }, { status: 400 });
    }

    // Eksekusi simpan ke database MySQL
    const newProject = await prisma.project.create({
      data: {
        title: title,
        description: description || null,
        mediaUrl: mediaUrl,
        projectType: projectType || "photo",
        userId: user.id
      }
    });

    // Catat ke History Aktivitas
    let actionLabel = "Mengunggah proyek baru";
    if (projectType === 'video') actionLabel = "Menambahkan portofolio video";
    if (projectType === 'certificate') actionLabel = "Mengunggah sertifikat baru";
    await logActivity(user.id, "UPLOAD_PROJECT", `${actionLabel}: "${title}"`);

    return NextResponse.json({ message: "Proyek berhasil ditambahkan", project: newProject }, { status: 201 });

  } catch (error) {
    console.error("Error Create Project:", error);
    return NextResponse.json({ error: "Gagal menyimpan proyek ke server" }, { status: 500 });
  }
}
// ... (Biarkan fungsi GET dan POST yang sudah ada di atasnya)

// 3. PATCH: Memperbarui Proyek yang sudah ada
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const body = await req.json();
    const { id, title, description, mediaUrl, projectType } = body;

    if (!id || !title || !mediaUrl) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Pastikan proyek tersebut benar-benar milik user yang sedang login
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject || existingProject.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // Eksekusi Update ke Database
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || null,
        mediaUrl,
        projectType
      }
    });

    await logActivity(user.id, "UPDATE_PROJECT", `Memperbarui proyek: "${title}"`);

    return NextResponse.json({ message: "Proyek berhasil diperbarui", project: updatedProject }, { status: 200 });

  } catch (error) {
    console.error("Error Update Project:", error);
    return NextResponse.json({ error: "Gagal memperbarui proyek" }, { status: 500 });
  }
}
// 4. DELETE: Menghapus Proyek
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    // Ambil ID dari URL parameter (contoh: /api/projects?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID proyek tidak valid" }, { status: 400 });

    // Pastikan proyek tersebut milik user yang sedang login
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject || existingProject.userId !== user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // Eksekusi penghapusan
    await prisma.project.delete({ where: { id } });
    await logActivity(user.id, "DELETE_PROJECT", `Menghapus proyek: "${existingProject.title}"`);

    return NextResponse.json({ message: "Proyek berhasil dihapus" }, { status: 200 });

  } catch (error) {
    console.error("Error Delete Project:", error);
    return NextResponse.json({ error: "Gagal menghapus proyek" }, { status: 500 });
  }
}