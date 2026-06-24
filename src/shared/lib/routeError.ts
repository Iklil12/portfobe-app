import { NextResponse } from "next/server";

/**
 * Utility standar untuk menangani error di API routes.
 * Mendukung dua pattern:
 * - Coded errors: "STATUS:message" (e.g., "404:User not found")
 * - Named errors: Lookup dari errorMap
 */
export function handleRouteError(
  error: unknown,
  errorMap: Record<string, { message: string; status: number }> = {},
  fallbackMessage = "Internal Server Error"
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  // Pattern 1: "STATUS:message" (contoh: "404:User not found")
  if (errorMessage.includes(":")) {
    const colonIndex = errorMessage.indexOf(":");
    const statusStr = errorMessage.substring(0, colonIndex);
    const status = parseInt(statusStr, 10);
    if (!isNaN(status) && status >= 100 && status < 600) {
      const msg = errorMessage.substring(colonIndex + 1);
      return NextResponse.json({ error: msg }, { status });
    }
  }

  // Pattern 2: Named error lookup
  const mapped = errorMap[errorMessage];
  if (mapped) {
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }

  // Fallback
  console.error("API Error:", error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
