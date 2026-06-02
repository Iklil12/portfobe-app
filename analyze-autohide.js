const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'components', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx'));

console.log(`Analyzing auto-hide logic in ${files.length} themes...\n`);

files.forEach(file => {
    
    const content = fs.readFileSync(path.join(themesDir, file), 'utf8');
    
    let issues = [];

    // Check Testimonials
    if (content.includes('testimonials.map') && !content.includes('testimonials.length > 0') && !content.includes('testimonials?.length > 0')) {
        issues.push("Testimonials not auto-hidden (might show empty state)");
    }

    // Check Certificates/Awards
    if ((content.includes('certificates.map') || content.includes('awards.map') || content.includes('awardItems.map')) && 
        !content.includes('certificates.length > 0') && 
        !content.includes('awards.length > 0') && 
        !content.includes('awardItems.length > 0') && 
        !content.includes('certificates?.length > 0') && 
        !content.includes('awards?.length > 0') && 
        !content.includes('awardItems?.length > 0')) {
        issues.push("Certificates/Awards not auto-hidden");
    }
    
    // MinimalistTheme specific check because it has ternary awards.length === 0 ? ... : ...
    if (content.includes('awards.length === 0 ?') || content.includes('awardItems.length === 0 ?') || content.includes('certificates.length === 0 ?')) {
        issues.push("Theme uses explicit empty state for awards instead of auto-hide");
    }

    // Check 3D Projects
    if ((content.includes('items3D.map') || content.includes('projects3D.map')) && 
        !content.includes('items3D.length > 0') && 
        !content.includes('projects3D.length > 0') &&
        !content.includes('items3D?.length > 0') &&
        !content.includes('projects3D?.length > 0')) {
        issues.push("3D Projects not auto-hidden");
    }

    // Check Widgets
    if (content.includes('<GithubStats') && !content.match(/\{.*<GithubStats/)) {
        issues.push("GithubStats rendered unconditionally (relies on widget internal empty state)");
    }
    if (content.includes('<CanvaShowcase') && !content.match(/\{.*<CanvaShowcase/)) {
        issues.push("CanvaShowcase rendered unconditionally");
    }
    if (content.includes('<PenpotShowcase') && !content.match(/\{.*<PenpotShowcase/)) {
        issues.push("PenpotShowcase rendered unconditionally");
    }

    if (issues.length > 0) {
        console.log(`[${file}]`);
        issues.forEach(i => console.log(`  - ${i}`));
    }
});
