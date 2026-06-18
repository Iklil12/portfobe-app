const fs = require('fs');
const path = require('path');

const blocksDir = path.join(__dirname, '..', 'components', 'blocks');

// Dapatkan semua file ExperienceBlock.tsx secara rekursif
function getExperienceFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getExperienceFiles(fullPath, files);
        } else if (file.endsWith('ExperienceBlock.tsx') || file.includes('ExperienceBlock')) {
            files.push(fullPath);
        }
    }
    return files;
}

const allFiles = getExperienceFiles(blocksDir);
console.log('Menemukan file experience:', allFiles);

for (const filePath of allFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Periksa apakah file sudah dinamis (atau di-skip)
    if (content.includes('experience_items') && content.includes('experiences.map')) {
        console.log(`File ${path.basename(filePath)} sudah dinamis. Skip.`);
        continue;
    }

    // Skip tema yang di-handle khusus karena strukturnya berbasis database bawaan (data.experiences)
    if (filePath.includes('KineticAvantGardeExperienceBlock.tsx') || filePath.includes('NexusNoirExperienceBlock.tsx') || filePath.includes('BentoGridExperienceBlock.tsx')) {
        console.log(`Skip ${path.basename(filePath)} karena di-handle khusus.`);
        continue;
    }

    // 1. Dapatkan nama fungsi utama
    const funcMatch = content.match(/export (?:function|default function) (\w+)/);
    if (!funcMatch) {
        console.log(`Gagal mendeteksi nama fungsi di ${path.basename(filePath)}`);
        continue;
    }
    const funcName = funcMatch[1];
    console.log(`Memproses ${funcName} di ${path.basename(filePath)}...`);

    // 2. Sisipkan fungsi-fungsi helper di dalam body fungsi
    const helperInsertion = `
    let experiences = [];
    try {
        if (customTexts.experience_items) {
            experiences = JSON.parse(customTexts.experience_items);
        } else {
            experiences = [
                { role: 'Senior Lead Developer', company: 'Tech Corp', duration: '2022 - Present', description: 'Memimpin tim arsitek antarmuka dalam merumuskan ulang batasan antara seni digital dan pengalaman pengguna.' },
                { role: 'Frontend Engineer', company: 'Startup Inc', duration: '2019 - 2022', description: 'Merancang sistem desain skala besar untuk perusahaan fintech, berfokus pada tipografi dan interaksi mikro.' },
                { role: 'UI Designer', company: 'Creative Agency', duration: '2017 - 2019', description: 'Merancang aset visual kreatif untuk berbagai klien global terkemuka.' }
            ];
        }
    } catch (e) {
        experiences = [];
    }

    const updateExperiences = (newExps: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'experience_items', value: JSON.stringify(newExps) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'role' | 'company' | 'duration' | 'description', value: string) => {
        const newExps = [...experiences];
        newExps[index][key] = value;
        updateExperiences(newExps);
    };

    const handleAddItem = () => {
        const newExps = [...experiences, { role: "Role Baru", company: "Perusahaan Baru", duration: "Tahun - Tahun", description: "Deskripsi pekerjaan baru." }];
        updateExperiences(newExps);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExps = experiences.filter((_: any, i: number) => i !== index);
        updateExperiences(newExps);
    };
`;

    // Cari posisi getCustomText
    const getCustomTextRegex = /const getCustomText = \([^)]*\) =>[^;]+;/;
    if (content.match(getCustomTextRegex)) {
        content = content.replace(getCustomTextRegex, (match) => `${match}\n${helperInsertion}`);
    } else {
        const funcOpenRegex = new RegExp(`export (?:function|default function) ${funcName}\\([^)]*\\)\\s*{`);
        content = content.replace(funcOpenRegex, (match) => `${match}\n    const customTexts = theme?.customTexts || {};\n    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;\n${helperInsertion}`);
    }

    // 3. Ganti mapping statis [1, 2, 3]
    const mapRegex = /\{\s*\[\s*1\s*,\s*2\s*,\s*3\s*\]\s*\.map\s*\(\s*\(\s*num\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)\s*\}/;
    const loopMatch = content.match(mapRegex);
    if (loopMatch) {
        let loopBody = loopMatch[1];
        
        // Ganti EditableText role
        loopBody = loopBody.replace(/<EditableText[^>]+field=\{`[^`]+_exp_role_\$\{num\}`\}[^>]+value=\{getCustomText\(`[^`]+_exp_role_\$\{num\}`\s*,\s*defaultRole\)\}[^>]*\/>/g, 
            `<EditableText 
                                         value={defaultRole} 
                                         onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                         isEditor={isEditor} 
                                         maxLength={50} 
                                         as="span" 
                                     />`
        );
        
        // Ganti EditableText company
        loopBody = loopBody.replace(/<EditableText[^>]+field=\{`[^`]+_exp_company_\$\{num\}`\}[^>]+value=\{getCustomText\(`[^`]+_exp_company_\$\{num\}`\s*,\s*defaultCompany\)\}[^>]*\/>/g, 
            `<EditableText 
                                             value={defaultCompany} 
                                             onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                             isEditor={isEditor} 
                                             maxLength={50} 
                                             as="span" 
                                         />`
        );

        // Ganti EditableText duration
        loopBody = loopBody.replace(/<EditableText[^>]+field=\{`[^`]+_exp_duration_\$\{num\}`\}[^>]+value=\{getCustomText\(`[^`]+_exp_duration_\$\{num\}`\s*,\s*defaultDuration\)\}[^>]*\/>/g, 
            `<EditableText 
                                             value={defaultDuration} 
                                             onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                             isEditor={isEditor} 
                                             maxLength={40} 
                                             as="span" 
                                         />`
        );

        // Ganti EditableText description (jika ada di loop body)
        loopBody = loopBody.replace(/<EditableText[^>]+field=\{`[^`]+_exp_desc_\$\{num\}`\}[^>]+value=\{getCustomText\(`[^`]+_exp_desc_\$\{num\}`\s*,\s*defaultDescription\)\}[^>]*\/>/g, 
            `<EditableText 
                                             value={defaultDescription} 
                                             onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                             isEditor={isEditor} 
                                             as="span" 
                                         />`
        );

        // Ubah variabel loop dari num ke exp/index
        const varInitRegex = /const defaultRole =[\s\S]+?const defaultDuration = [^;]+;/;
        const newVarInit = `const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';`;
        
        loopBody = loopBody.replace(varInitRegex, newVarInit);

        // Ganti key={num} menjadi key={index}
        loopBody = loopBody.replace(/key=\{num\}/, 'key={index}');
        
        // Tambahkan relative class pada container div terluar jika belum ada
        const divClassRegex = /className="([^"]+)"/;
        const divMatch = loopBody.match(divClassRegex);
        if (divMatch) {
            const originalClasses = divMatch[1];
            if (!originalClasses.includes('relative')) {
                loopBody = loopBody.replace(divClassRegex, `className="${originalClasses} relative"`);
            }
        }

        // Tambahkan tombol delete sebelum tag penutup div terluar
        const deleteButton = `
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Hapus Pengalaman"
                                >
                                    ✕
                                </button>
                            )}
                        </div>`;
        
        const lastDivRegex = /<\/div>\s*\);\s*$/;
        if (loopBody.match(lastDivRegex)) {
            loopBody = loopBody.replace(lastDivRegex, deleteButton + '\n                    );');
        }

        // Terapkan loop mapping baru ke konten
        const newMapContent = `{experiences.map((exp: any, index: number) => {${loopBody}})}`;
        content = content.replace(mapRegex, newMapContent);
    } else {
        console.log(`Gagal mencocokkan loop map di ${path.basename(filePath)}`);
    }

    // 4. Tambahkan tombol "+ Tambah Pengalaman" setelah div penutup container loop
    const penutupGridRegex = /\}\)\}\s*<\/div>/;
    if (content.match(penutupGridRegex)) {
        content = content.replace(penutupGridRegex, (match) => {
            return `})}
            </div>
            {isEditor && (
                <div className="flex justify-center mt-12 w-full col-span-full">
                    <button
                        onClick={handleAddItem}
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}`;
        });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Berhasil mengubah ${path.basename(filePath)} menjadi dinamis!`);
}

console.log('Semua file experience berhasil diperbarui!');
