const fs = require('fs');

// 1. Fix blockSeeder.ts
let seederPath = 'lib/blockSeeder.ts';
if (fs.existsSync(seederPath)) {
  let content = fs.readFileSync(seederPath, 'utf8');
  content = content.replace(/import prisma from ['"]\.\/prisma['"]/g, 'import prisma from "@/shared/lib/prisma"');
  fs.writeFileSync(seederPath, content, 'utf8');
}

// 2. Fix all authOptions imports across the whole project
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next') && !file.includes('scratch')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Change import { authOptions } from '@/entities/user/api/auth'
  // to import { authOptions } from '@/entities/user/api/auth'
  content = content.replace(/from\s+['"]@\/entities\/user['"]/g, "from '@/entities/user/api/auth'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Total files updated for authOptions: ${changedCount}`);
