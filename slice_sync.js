const fs = require('fs');
const lines = fs.readFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', 'utf8').split('\n');

// Keep lines:
// 0 to 26 (0-indexed lines 1 to 27)
// 366 to 495 (0-indexed lines 367 to 496)
// 539 to end (0-indexed lines 540 to end)

const newLines = [
  ...lines.slice(0, 27),
  ...lines.slice(366, 496),
  ...lines.slice(539)
];

fs.writeFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', newLines.join('\n'));
console.log('Sliced out redundant blocks');
