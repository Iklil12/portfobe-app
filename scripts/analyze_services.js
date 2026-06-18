const fs = require('fs');
const path = require('path');

const blocksDir = path.join(__dirname, '..', 'components', 'blocks');

function getServicesFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getServicesFiles(fullPath, files);
        } else if (file.endsWith('ServicesBlock.tsx') || file.includes('ServicesBlock')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = getServicesFiles(blocksDir);
console.log(`Menemukan ${files.length} file ServicesBlock:\n`);

for (const f of files) {
    const content = fs.readFileSync(f, 'utf-8');
    const relativePath = path.relative(path.join(__dirname, '..'), f);
    
    // Cari definisi array services
    // Contoh: const services = [ ... ] atau let services = [ ... ]
    const arrayMatch = content.match(/(?:const|let|var)\s+services\s*=\s*\[([\s\S]*?)\];/i);
    
    if (arrayMatch) {
        console.log(`=== ${relativePath} ===`);
        console.log(`Definisi array: const services = [ ... ] ditemukan.`);
        // Ekstrak baris-baris di dalam array
        const lines = arrayMatch[1].trim().split('\n').map(l => l.trim()).filter(Boolean);
        console.log(`Jumlah default item: ${lines.length}`);
        console.log(`Contoh item:\n  ${lines.slice(0, 2).join('\n  ')}\n`);
    } else {
        // Coba cari loop atau property dinamis jika tidak ada array statis
        console.log(`=== ${relativePath} ===`);
        if (content.includes('data?.services') || content.includes('data.services')) {
            console.log(`Menggunakan data dinamis database (data.services).`);
        } else {
            console.log(`Format array tidak standar.`);
            // Cari kata kunci loop atau rendering
            const lines = content.split('\n');
            const matches = lines.filter(l => l.includes('.map(') || l.includes('services'));
            console.log(`Baris terkait map/services:\n  ${matches.slice(0, 3).join('\n  ')}\n`);
        }
    }
}
