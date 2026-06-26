import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/entities/user/api/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Cloudinary configuration missing on server" }, { status: 500 });
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData
    });

    const data = await res.json();

    if (res.ok && data.secure_url) {
      return NextResponse.json({ secure_url: data.secure_url });
    } else {
      console.error("Cloudinary returned error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to upload to Cloudinary" }, { status: res.status });
    }
  } catch (error: any) {
    console.error("Proxy upload error:", error);
    return NextResponse.json({ error: "Internal server proxy error" }, { status: 500 });
  }
}
