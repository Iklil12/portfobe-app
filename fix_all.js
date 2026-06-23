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

  // Add import if missing
  if (!content.includes("import { invalidatePortfolioCache }")) {
    content = "import { invalidatePortfolioCache } from '@/lib/redis';\n" + content;
    changed = true;
  }

  // Also make sure 'user.id' vs 'session.user.id' is correct.
  // In some blocks API, 'user' is not defined, only 'session.user.id'.
  // My previous script injected wait invalidatePortfolioCache(session.user.id);
  // Let's check if there are any TS errors from 'user.id' undefined.
  if (content.includes('await invalidatePortfolioCache(user.id);') && !content.includes('const user =')) {
    // If 'user' is not defined, but 'session.user' is, we must replace it.
    if (content.includes('session.user.id')) {
      content = content.replace(/await invalidatePortfolioCache\(user\.id\);/g, 'await invalidatePortfolioCache(session.user.id);');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log('Fixed imports/vars in:', relPath);
  }
}
