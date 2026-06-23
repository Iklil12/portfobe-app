const fs = require('fs');
const lines = fs.readFileSync('c:/Users/user/portfobe-app/components/sections/SyncEngineSection.tsx', 'utf8').split('\n');

const analyticsCode = "use client";\n\nimport React, { useRef, useState, useEffect } from 'react';\nimport { motion, AnimatePresence, useInView } from 'framer-motion';\n\n + lines.slice(23, 253).join('\n');
fs.writeFileSync('c:/Users/user/portfobe-app/components/sections/sync-engine/AnalyticsDashboard.tsx', analyticsCode);

const patternsCode = "use client";\n\nimport React, { memo } from 'react';\n\n + lines.slice(257, 361).join('\n');
fs.writeFileSync('c:/Users/user/portfobe-app/components/sections/sync-engine/SyncEnginePatterns.tsx', patternsCode);

const lazyCode = "use client";\n\nimport React, { useRef, useState, useEffect } from 'react';\n\n + lines.slice(497, 534).join('\n');
fs.writeFileSync('c:/Users/user/portfobe-app/components/sections/sync-engine/LazyMobilePillar.tsx', lazyCode);

console.log('Files extracted successfully');
