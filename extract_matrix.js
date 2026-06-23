const fs = require('fs');
const lines = fs.readFileSync('c:/Users/user/portfobe-app/app/pricing/page.tsx', 'utf8').split('\n');
const tableLines = lines.slice(185, 544).join('\n');
const header = "import React from 'react';\nimport Link from 'next/link';\nimport { Check, X, Layers, Grid, Palette, Award, EyeOff, Globe, Gift, BarChart2, Code, Headphones, Sparkles, HelpCircle, Crown } from 'lucide-react';\n\nexport function PricingFeatureMatrix({ pricing, billingCycle, formatIDR }: { pricing: any, billingCycle: 'monthly' | 'yearly', formatIDR: (num: number) => string }) {\n  return (\n";
const footer = "\n  );\n}\n";
fs.writeFileSync('c:/Users/user/portfobe-app/components/pricing/PricingFeatureMatrix.tsx', header + tableLines + footer);
console.log('Matrix extracted');
