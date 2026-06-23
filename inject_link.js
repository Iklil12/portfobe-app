const fs = require('fs');
const file = 'c:/Users/user/portfobe-app/app/api/links/route.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('const rateLimitResponse = await checkRateLimit();', 'const rateLimitResponse = await checkRateLimit(15, 60 * 1000, "create_link");');
fs.writeFileSync(file, content);
