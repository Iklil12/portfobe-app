const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/blocks/faq/themes');
const files = fs.readdirSync(dir);

let totalReplaced = 0;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const qRegex = /\{isEditor \? \([\s\S]*?onBlur=\{\(e\) => handleUpdateItem\(i, 'q', e\.currentTarget\.innerText\)\}[\s\S]*?className="break-words break-all whitespace-pre-wrap outline-none cursor-text([^"]*)"[\s\S]*?\{faq\.q\}[\s\S]*?\) : \([\s\S]*?faq\.q[\s\S]*?\)\}/g;
    
    const aRegex = /\{isEditor \? \([\s\S]*?onBlur=\{\(e\) => handleUpdateItem\(i, 'a', e\.currentTarget\.innerText\)\}[\s\S]*?className="break-words break-all whitespace-pre-wrap outline-none cursor-text([^"]*)"[\s\S]*?\{faq\.a\}[\s\S]*?\) : \([\s\S]*?faq\.a[\s\S]*?\)\}/g;

    let modified = false;

    if (qRegex.test(content)) {
      content = content.replace(qRegex, '<EditableText value={faq.q} onChange={(val) => handleUpdateItem(i, "q", val)} isEditor={isEditor} maxLength={150} className={"outline-none cursor-text$1"} />');
      modified = true;
    }

    if (aRegex.test(content)) {
      content = content.replace(aRegex, '<EditableText value={faq.a} onChange={(val) => handleUpdateItem(i, "a", val)} isEditor={isEditor} maxLength={1000} className={"outline-none cursor-text$1"} />');
      modified = true;
    }

    if (modified) {
      // Pastikan ada import EditableText
      if (!content.includes("import { EditableText }")) {
        // Cari baris import React
        content = content.replace(/(import React.*?;\n)/, '$1import { EditableText } from "@/components/ui/EditableText";\n');
      }
      fs.writeFileSync(filePath, content, 'utf8');
      totalReplaced++;
    }
  }
});

console.log("Total replaced files:", totalReplaced);
