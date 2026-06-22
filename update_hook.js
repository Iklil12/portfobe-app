const fs = require('fs');
let code = fs.readFileSync('hooks/useThemeEditor.ts', 'utf8');

if (!code.includes('import useSWR')) {
  code = code.replace(`import { mutate } from 'swr';`, `import useSWR, { mutate } from 'swr';`);
}

const startIndex = code.indexOf('  useEffect(() => {\r\n    const fetchData = async () => {\r\n      try {\r\n        const resApp = await fetch');
if (startIndex === -1) {
  const altStartIndex = code.indexOf('  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        const resApp = await fetch');
  if (altStartIndex !== -1) {
    code = code.slice(0, altStartIndex) + "%%START%%" + code.slice(altStartIndex);
  } else {
    console.log("Could not find start index");
    process.exit(1);
  }
} else {
  code = code.slice(0, startIndex) + "%%START%%" + code.slice(startIndex);
}

const endIndex = code.indexOf('// Toggle favorit via API baru');
if (endIndex === -1) {
  console.log("Could not find end index");
  process.exit(1);
}

const startMarker = code.indexOf("%%START%%");
if (startMarker !== -1) {
  const SWR_CODE = fs.readFileSync('scratch_hook_SWR.ts', 'utf8');
  const newCode = code.slice(0, startMarker) + SWR_CODE + '\n\n  ' + code.slice(endIndex);
  fs.writeFileSync('hooks/useThemeEditor.ts', newCode);
  console.log('Replace successful');
}
