const fs = require('fs');
const path = require('path');

const files = [
  'app/api/testimonials/[id]/route.ts',
  'app/api/testimonials/reorder/route.ts'
];

for (const relPath of files) {
  const fullPath = path.join('c:/Users/user/portfobe-app', relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Replace invalid userId with (session.user as any).id if user is not defined
  if (content.includes('await invalidatePortfolioCache(userId);') && !content.includes('const userId =')) {
    content = content.replace(/await invalidatePortfolioCache\(userId\);/g, 'await invalidatePortfolioCache((session.user as any).id);');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log('Fixed ReferenceError in:', relPath);
  }
}
