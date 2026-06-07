const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components/blocks/faq/themes');
const files = fs.readdirSync(dir);

let totalReplaced = 0;

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let modified = false;

    // This regex looks for className inside EditableText and removes editor-specific classes
    // Even if it spans multiple lines or has spaces.
    content = content.replace(/className=\{?["'`]?(.*?)["'`]?\}?/g, (match, classes) => {
      // ONLY modify if we find editor classes
      if (classes.includes('hover:shadow-[0_0_0_1px_#007bff]')) {
        let newClasses = classes
          .replace(/outline-none/g, '')
          .replace(/cursor-text/g, '')
          .replace(/transition-all/g, '')
          .replace(/hover:shadow-\[0_0_0_1px_#007bff\]/g, '')
          .replace(/focus:shadow-\[0_0_0_1px_#007bff\]/g, '')
          .replace(/focus:bg-\[#007bff\]\/\d+/g, '')
          .replace(/\s+/g, ' ')
          .trim();
          
        modified = true;
        // Reconstruct className
        if (match.startsWith('className={')) {
           return 'className={"' + newClasses + '"}';
        } else {
           return 'className="' + newClasses + '"';
        }
      }
      return match;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalReplaced++;
    }
  }
});

console.log("Total replaced files:", totalReplaced);
