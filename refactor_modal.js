const fs = require('fs');
let code = fs.readFileSync('c:/Users/user/portfobe-app/components/features/projects/ProjectFormModal.tsx', 'utf8');

const imports = "import { UpgradeToProModal } from './UpgradeToProModal';\nimport { ProjectTypeSelection } from './ProjectTypeSelection';\n";
code = code.replace("import { useProjectUpload } from './useProjectUpload';", "import { useProjectUpload } from './useProjectUpload';\n" + imports);

// Replace UpgradeToProModal
const upgradeStart = code.indexOf('{/* MODAL UPGRADE PRO */}');
const upgradeEnd = code.indexOf('</AnimatePresence>\n    </div>');

// Keep </AnimatePresence>\n    </div>\n  );\n}
if (upgradeStart !== -1 && upgradeEnd !== -1) {
  code = code.substring(0, upgradeStart) + 
         '<UpgradeToProModal showUpgradeModal={showUpgradeModal} setShowUpgradeModal={setShowUpgradeModal} />\n      ' + 
         code.substring(upgradeEnd + '</AnimatePresence>'.length);
}

// Replace ProjectTypeSelection
const typeStart = code.indexOf('<motion.div\n                    key="type-selection"');
const typeEnd = code.indexOf('                  </motion.div>\n                ) : (\n                  // --- STEP 2: FORM ISIAN ---');

if (typeStart !== -1 && typeEnd !== -1) {
  code = code.substring(0, typeStart) + 
         '<ProjectTypeSelection userPlan={userPlan} setProjectType={setProjectType} setShowUpgradeModal={setShowUpgradeModal} />\n' + 
         code.substring(typeEnd + '                  </motion.div>'.length);
}

fs.writeFileSync('c:/Users/user/portfobe-app/components/features/projects/ProjectFormModal.tsx', code);
console.log('Refactoring complete 3');
