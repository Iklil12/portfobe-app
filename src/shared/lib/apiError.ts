import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleApiError(error: unknown) {
  console.error('[API Error]:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: `Validation failed: ${error.issues.map((e: any) => `${e.path.join('.')} - ${e.message}`).join(', ')}`, 
        details: error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`) 
      },
      { status: 400 }
    );
  }

  // Handle known custom errors or Prisma errors if we can parse them
  let message = "Failed to process request";
  let status = 500;
  let code = "INTERNAL_ERROR";

  if (error instanceof Error) {
    message = error.message;
    // Map known custom error messages
    if (message === "USER_NOT_FOUND") { message = "User not found"; status = 404; }
    else if (message === "QUOTA_EXCEEDED") { message = "FREE plan quota reached. Please upgrade to PRO."; status = 403; code = "QUOTA_EXCEEDED"; }
    else if (message === "MISSING_DATA") { message = "Incomplete data provided"; status = 400; }
    else if (message === "INVALID_URL") { message = "Invalid media URL format"; status = 400; }
    else if (message === "FORBIDDEN") { message = "Access denied"; status = 403; }
    else if (message.includes("Record to update not found") || message.includes("Record to delete does not exist")) {
      message = "Data not found";
      status = 404;
    }
  }

  return NextResponse.json({ error: message, code }, { status });
}
