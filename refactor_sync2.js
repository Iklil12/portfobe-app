const fs = require('fs');
const code = fs.readFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', 'utf8');

// This time use very safe string indexOf based substring slicing.

const importsIndex = code.indexOf(import './sync-engine-integrations.css';\nimport { AnalyticsDashboard });
const headerEndIndex = code.indexOf(// ============================================================================
// ARTISTIC CONCEPT: THE INFINITE DATA SEA (PURE ABSTRACT EXHIBITION));

const analyticsStart = code.indexOf('export function AnalyticsDashboard({ instanceId }: { instanceId?: string }) {');
const analyticsEnd = code.indexOf('// ============================================================================
// MEMOIZED SVG PATTERNS — Prevents recreation on every parent render');

const patternsEnd = code.indexOf('const PILLARS: Pillar[] = [');

const lazyPillarStart = code.indexOf('function LazyMobilePillar({ children, height = \'400px\' }: { children: React.ReactNode; height?: string }) {');
const lazyPillarEnd = code.indexOf('export function SyncEngineSection() {');

if (analyticsStart === -1 || lazyPillarStart === -1) {
  console.log('Could not find start index');
  process.exit(1);
}

let newCode = code.substring(0, analyticsStart) + 
              code.substring(patternsEnd, lazyPillarStart) + 
              code.substring(lazyPillarEnd);

// Remove the Pillar interface if needed, or leave it. It's safe.
// Remove duplicate memoized svg patterns block:
// Wait, the patterns were inside analyticsEnd to patternsEnd which I excluded! code.substring(patternsEnd, lazyPillarStart)

fs.writeFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', newCode);
console.log('Refactoring complete 2');
