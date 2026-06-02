const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx'));

console.log("Mengecek Testimoni, 3D, dan Sertifikat...\n");

files.forEach(file => {
    const content = fs.readFileSync(path.join(themesDir, file), 'utf8');
    let missing = [];

    if (!content.includes('testimonials.map') && !content.includes('TestimonialSection')) {
        missing.push('Testimoni');
    }
    
    if (!content.includes('items3D.map') && !content.includes('projects3D.map') && !content.includes('<Interactive3DViewer')) {
        missing.push('Proyek 3D');
    }

    if (!content.includes('certificates.map') && !content.includes('awardItems.map') && !content.includes('awards.map')) {
        missing.push('Sertifikat/Awards');
    }

    if (missing.length > 0) {
        console.log(`- [${file}]: Tidak memiliki seksi ${missing.join(', ')}`);
    }
});
