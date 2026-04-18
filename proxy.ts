import middleware from "next-auth/middleware";

// Next.js 16 meminta fungsi diekspor secara eksplisit
export default function proxy(req: any) {
  return middleware(req);
}

export const config = { 
  // Mengunci folder dashboard dan semua sub-foldernya
  matcher: ["/dashboard/:path*"] 
};