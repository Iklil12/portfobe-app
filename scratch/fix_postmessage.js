const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  // Replace postMessage(..., '*') with postMessage(..., window.location.origin)
  newContent = newContent.replace(/postMessage\(([^,]+(?:,[^,]+)*?),\s*'\*'\s*\)/g, 'postMessage($1, window.location.origin)');

  // Also catch cases where the object is the first argument, e.g. postMessage({ ... }, '*')
  // The regex above /postMessage\(([^,]+(?:,[^,]+)*?),\s*'\*'\s*\)/g actually handles this, but let's test it against a sample.
  // Wait, if the object contains commas, `[^,]+(?:,[^,]+)*?` will match it, but it's better to use a non-greedy match until the last comma before '*'
  newContent = newContent.replace(/postMessage\(([\s\S]*?),\s*'\*'\s*\)/g, 'postMessage($1, window.location.origin)');

  // Validate we only changed '*' to window.location.origin
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed:', filePath);
  }
}

const targetDirs = [
  path.join(__dirname, '..', 'components'),
  path.join(__dirname, '..', 'app')
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, replaceInFile);
  }
});
