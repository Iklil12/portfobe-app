const fs = require('fs');
const file = 'components/features/projects/ProjectFormModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all font-awesome icons with emojis
content = content.replace(/icon:\s*['"]fa-exclamation(-triangle)?['"]/g, 'icon: "⚠️"');
content = content.replace(/icon:\s*['"]fa-times(-circle)?['"]/g, 'icon: "❌"');
content = content.replace(/icon:\s*['"]fa-check(-circle)?['"]/g, 'icon: "✅"');
content = content.replace(/icon:\s*['"]fa-wifi['"]/g, 'icon: "⚠️"');
content = content.replace(/icon:\s*['"]fa-bolt['"]/g, 'icon: "⚡"');

// Replace remaining technical texts
content = content.replace(/Aset berhasil dilampirkan via Edge Node ⚡/g, 'Gambar berhasil diunggah dengan cepat ⚡');
content = content.replace(/Aset berhasil dilampirkan via Edge Node/g, 'Gambar berhasil diunggah dengan cepat');
content = content.replace(/Terjadi kesalahan jaringan Edge/g, 'Terjadi kesalahan jaringan saat mengunggah');
content = content.replace(/3D Model berhasil diunggah!/g, '3D Model berhasil diunggah ⚡');

fs.writeFileSync(file, content);
console.log('Replacements completed successfully.');
