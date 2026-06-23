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
  if (!fs.existsSync(fullPath)) {
    console.log('Not found:', relPath);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Inject import
  if (!content.includes('invalidatePortfolioCache')) {
    content = content.replace(/(import .*?\n)/, "\ { invalidatePortfolioCache } from '@/lib/redis';\n");
  }

  // Define what userId variable is used
  let userVar = 'session.user.id';
  if (content.includes('user.id')) {
    userVar = 'user.id';
  } else if (content.includes('userId')) {
    userVar = 'userId';
  }

  // Find all return NextResponse.json
  const returnRegex = /(\n\s*)(return NextResponse\.json\(\s*(?:newLink|updatedLink|newTestimonial|updatedTestimonial|newCertificate|updatedCertificate|\{ message:|\{ success:|\{ data:))/g;

  content = content.replace(returnRegex, (match, space, theReturn) => {
    return space + "await invalidatePortfolioCache(" + userVar + ");" + space + "await invalidatePortfolioCache(session.user.id); // fallback".replace('await invalidatePortfolioCache(session.user.id); // fallback', '') + space + theReturn.trim();
  });

  // Specifically for DELETEs that just return success message
  const delRegex = /(\n\s*)(return NextResponse\.json\(\s*\{ message: ".*? dihapus.*?" \}\s*\))/g;
  content = content.replace(delRegex, (match, space, theReturn) => {
    if (content.substring(match.index - 80, match.index).includes('invalidatePortfolioCache')) return match;
    return space + "await invalidatePortfolioCache(" + userVar + ");" + space + theReturn.trim();
  });

  fs.writeFileSync(fullPath, content);
  console.log('Injected cache invalidation into:', relPath);
}
