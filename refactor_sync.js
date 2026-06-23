const fs = require('fs');
let code = fs.readFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', 'utf8');

code = code.replace(/export function AnalyticsDashboard[\s\S]*?\}\n\n/g, '');
code = code.replace(/\/\/ ============================================================================\n\/\/ MEMOIZED SVG PATTERNS — Prevents recreation on every parent render\n\/\/ ============================================================================\nconst GitHubPattern = memo\(function GitHubPattern\(\) \{[\s\S]*?\}\);\n/g, '');
code = code.replace(/const PenpotPattern = memo\(function PenpotPattern\(\) \{[\s\S]*?\}\);\n/g, '');
code = code.replace(/const CanvaPattern = memo\(function CanvaPattern\(\) \{[\s\S]*?\}\);\n/g, '');
code = code.replace(/const AIPattern = memo\(function AIPattern\(\) \{[\s\S]*?\}\);\n/g, '');
code = code.replace(/\/\/ ============================================================================\n\/\/ LAZY MOBILE PILLAR — Only render heavy components when scrolled into view\n\/\/ Uses IntersectionObserver with rootMargin for preloading\.\n\/\/ Once mounted, stays mounted to preserve state \(no re-init cost\)\.\n\/\/ ============================================================================\nfunction LazyMobilePillar\(\{ children, height = '400px' \}: \{ children: React.ReactNode; height\?: string \}\) \{[\s\S]*?\}\n\n/g, '');

const imports = "import { AnalyticsDashboard } from './sync-engine/AnalyticsDashboard';\n" +
"import { GitHubPattern, PenpotPattern, CanvaPattern, AIPattern } from './sync-engine/SyncEnginePatterns';\n" +
"import { LazyMobilePillar } from './sync-engine/LazyMobilePillar';\n";

code = code.replace("import './sync-engine-integrations.css';", "import './sync-engine-integrations.css';\n" + imports);

fs.writeFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', code);
console.log('Refactoring complete');
