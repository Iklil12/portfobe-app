const fs = require('fs');

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

  // constants.ts
  content = content.replace(/['"]@\/lib\/constants['"]/g, "'@/shared/constants/constants'");
  content = content.replace(/['"](?:\.\.\/)+lib\/constants['"]/g, "'@/shared/constants/constants'");
  content = content.replace(/['"]@\/lib\/constants\/reserved-usernames['"]/g, "'@/shared/constants/reserved-usernames'");
  content = content.replace(/['"](?:\.\.\/)+lib\/constants\/reserved-usernames['"]/g, "'@/shared/constants/reserved-usernames'");

  // lib tools
  const tools = ['activity', 'bunnySign', 'mail', 'videoUtils', 'blockSeeder'];
  tools.forEach(tool => {
    const regex1 = new RegExp(`['"]@\\/lib\\/${tool}['"]`, 'g');
    const regex2 = new RegExp(`['"](?:\\.\\.\\/)+lib\\/${tool}['"]`, 'g');
    content = content.replace(regex1, `'@/shared/lib/${tool}'`);
    content = content.replace(regex2, `'@/shared/lib/${tool}'`);
  });

  // seo
  content = content.replace(/['"]@\/lib\/seo\/indexNow['"]/g, "'@/shared/seo/indexNow'");
  content = content.replace(/['"](?:\.\.\/)+lib\/seo\/indexNow['"]/g, "'@/shared/seo/indexNow'");

  // store
  content = content.replace(/['"]@\/lib\/store\/themeStore['"]/g, "'@/shared/store/themeStore'");
  content = content.replace(/['"](?:\.\.\/)+lib\/store\/themeStore['"]/g, "'@/shared/store/themeStore'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Total files updated: ${changedCount}`);
