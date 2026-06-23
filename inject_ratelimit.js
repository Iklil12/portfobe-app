const fs = require('fs');
const path = require('path');

const files = [
  'app/api/projects/upload-image/route.ts',
  'app/api/projects/upload-video/route.ts',
  'app/api/projects/upload-3d/route.ts'
];

for (const relPath of files) {
  const fullPath = path.join('c:/Users/user/portfobe-app', relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Add import if missing
  if (!content.includes('checkRateLimit')) {
    content = content.replace(/(import .*?\n)/, "\ { checkRateLimit } from '@/lib/rate-limit';\n");
    changed = true;
  }

  // Find POST function and insert specific rate limit
  if (content.includes('export async function POST')) {
    // If it already has generic checkRateLimit(), replace it
    if (content.match(/const rateLimitResponse = await checkRateLimit\(\);/)) {
      content = content.replace(
        /const rateLimitResponse = await checkRateLimit\(\);/,
        const rateLimitResponse = await checkRateLimit(10, 5 * 60 * 1000, "upload_media");
      );
      changed = true;
    } else if (!content.includes('upload_media')) {
      // Insert right after export async function POST(req: Request) {
      content = content.replace(
        /(export async function POST\([^)]*\)\s*\{)(\s*)/,
        \\ rateLimitResponse = await checkRateLimit(10, 5 * 60 * 1000, "upload_media");\n\ (rateLimitResponse) return rateLimitResponse;\n\
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log('Added rate limit to:', relPath);
  }
}
