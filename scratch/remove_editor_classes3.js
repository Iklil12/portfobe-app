const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/blocks/faq/themes');
const files = fs.readdirSync(dir);

let totalReplaced = 0;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const initialContent = content;
    
    // Replace the exact classes without regex
    content = content.split('outline-none cursor-text transition-all hover:shadow-[0_0_0_1px_#007bff] focus:shadow-[0_0_0_1px_#007bff] focus:bg-[#007bff]/20 ').join('');
    content = content.split('outline-none cursor-text transition-all hover:shadow-[0_0_0_1px_#007bff] focus:shadow-[0_0_0_1px_#007bff] focus:bg-[#007bff]/10 ').join('');

    // Fallback if some spaces differ
    content = content.replace(/outline-none cursor-text transition-all hover:shadow-\[0_0_0_1px_#007bff\] focus:shadow-\[0_0_0_1px_#007bff\] focus:bg-\[#007bff\]\/\d+\s*/g, '');

    if (content !== initialContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalReplaced++;
    }
  }
});

console.log("Total replaced files:", totalReplaced);
