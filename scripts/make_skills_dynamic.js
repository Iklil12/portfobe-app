const fs = require('fs');
const path = require('path');

const blocksDir = path.join(__dirname, '..', 'components', 'blocks');

// Dapatkan semua file SkillsBlock.tsx secara rekursif
function getSkillsFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getSkillsFiles(fullPath, files);
        } else if (file.endsWith('SkillsBlock.tsx') || file.includes('SkillsBlock')) {
            files.push(fullPath);
        }
    }
    return files;
}

const allFiles = getSkillsFiles(blocksDir);
console.log('Menemukan file skills:', allFiles);

for (const filePath of allFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Periksa apakah file sudah dinamis (atau di-skip)
    if (content.includes('skills_items') && content.includes('skills.map')) {
        console.log(`File ${path.basename(filePath)} sudah dinamis. Skip.`);
        continue;
    }

    // Skip HorizontalFlow dan NexusNoir karena akan kita handle terpisah / sudah dihandle
    if (filePath.includes('HorizontalFlowSkillsBlock.tsx') || filePath.includes('NexusNoirSkillsBlock.tsx') || filePath.includes('KineticAvantGardeSkillsBlock.tsx') || filePath.includes('SplitScreenStudioSkillsBlock.tsx')) {
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
    let skills = [];
    try {
        if (customTexts.skills_items) {
            skills = JSON.parse(customTexts.skills_items);
        } else {
            skills = [
                { name: 'Frontend Development', level: 95 },
                { name: 'UI/UX Design', level: 90 },
                { name: 'Backend Systems', level: 85 },
                { name: 'Creative Direction', level: 90 }
            ];
        }
    } catch (e) {
        skills = [];
    }

    const updateSkills = (newSkills: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'skills_items', value: JSON.stringify(newSkills) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'name' | 'level', value: string) => {
        const newSkills = [...skills];
        if (key === 'level') {
            const parsed = parseInt(value, 10);
            newSkills[index][key] = isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
        } else {
            newSkills[index][key] = value;
        }
        updateSkills(newSkills);
    };

    const handleAddItem = () => {
        const newSkills = [...skills, { name: "New Skill", level: 80 }];
        updateSkills(newSkills);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSkills = skills.filter((_: any, i: number) => i !== index);
        updateSkills(newSkills);
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

    // 3. Ganti mapping statis [1, 2, 3, 4]
    const mapRegex = /\{\s*\[\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*\]\s*\.map\s*\(\s*\(\s*num\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)\s*\}/;
    const loopMatch = content.match(mapRegex);
    if (loopMatch) {
        let loopBody = loopMatch[1];
        
        // Ganti EditableText nama skill
        loopBody = loopBody.replace(/<EditableText[^>]+field=\{`[^`]+_skill_name_\$\{num\}`\}[^>]+value=\{getCustomText\(`[^`]+_skill_name_\$\{num\}`\s*,\s*defaultName\)\}[^>]*\/>/g, 
            `<EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />`
        );
        
        // Ganti EditableText level skill
        loopBody = loopBody.replace(/<EditableText[^>]+field=\{`[^`]+_skill_prof_\$\{num\}`\}[^>]+value=\{getCustomText\(`[^`]+_skill_prof_\$\{num\}`\s*,\s*defaultProficiency\)\}[^>]*\/>/g, 
            `<EditableText 
                                        value={defaultProficiency} 
                                        onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />`
        );

        // Ubah variabel loop dari num ke skill/index
        const varInitRegex = /const defaultName =[\s\S]+?const safeVal = isNaN\(val\) \? 0 : Math\.min\(100, Math\.max\(0, val\)\);/;
        const newVarInit = `const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));`;
        
        loopBody = loopBody.replace(varInitRegex, newVarInit);

        // Ganti key={num} menjadi key={index}
        loopBody = loopBody.replace(/key=\{num\}/, 'key={index}');
        
        // Tambahkan relative class pada container div terluar
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
                                    title="Hapus Skill"
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
        const newMapContent = `{skills.map((skill: any, index: number) => {${loopBody}})}`;
        content = content.replace(mapRegex, newMapContent);
    } else {
        console.log(`Gagal mencocokkan loop map di ${path.basename(filePath)}`);
    }

    // 4. Tambahkan tombol "+ Tambah Skill" setelah div penutup container
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
                        + Tambah Skill
                    </button>
                </div>
            )}`;
        });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Berhasil mengubah ${path.basename(filePath)} menjadi dinamis!`);
}

console.log('Semua file skills berhasil diperbarui!');
