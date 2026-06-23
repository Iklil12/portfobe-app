const fs = require('fs');
const path = require('path');

const files = [
  'app/api/links/route.ts',
  'app/api/links/[id]/route.ts',
  'app/api/testimonials/route.ts',
  'app/api/testimonials/[id]/route.ts',
  'app/api/testimonials/reorder/route.ts',
  'app/api/certificates/route.ts',
  'app/api/blocks/toggle/route.ts',
  'app/api/blocks/bulk/route.ts',
  'app/api/blocks/reorder/route.ts'
];

for (const relPath of files) {
  const fullPath = path.join('c:/Users/user/portfobe-app', relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Check if it got corrupted
  if (content.includes('{ invalidatePortfolioCache } from')) {
    // If it's missing 'import', it means it replaced 'import { NextResponse } ...'
    if (!content.includes('import { NextResponse }')) {
      content = content.replace(
        /\{\s*invalidatePortfolioCache\s*\}\s*from\s*['"]@\/lib\/redis['"];/, 
        "import { NextResponse } from 'next/server';\nimport { invalidatePortfolioCache } from '@/lib/redis';"
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log('Fixed imports in:', relPath);
  }
}
