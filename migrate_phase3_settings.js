/**
 * Phase 3 mega-migration: Settings + small dashboard pages
 * Adds DashboardSettings namespace and migrates all Settings UI components + page
 */
const fs = require('fs');

// ══════════════════════════════════════════════════════════════════════════════
// STEP 1: Update dictionaries
// ══════════════════════════════════════════════════════════════════════════════

const en = JSON.parse(fs.readFileSync('messages/en.json','utf8'));
const id = JSON.parse(fs.readFileSync('messages/id.json','utf8'));

en.DashboardSettings = {
  // Page
  settingsBadge: "Settings",
  pageTitle: "Settings",
  pageDesc: "Manage account, security, billing, and integrations from one place.",
  tabAccount: "Account & Security",
  tabBilling: "Billing & Subscription",
  tabIntegrations: "Integrations",
  tabSoon: "Soon",
  loadingSettings: "Loading settings...",
  comingSoonTitle: "Coming Soon",
  comingSoonDesc: "Connect third-party services like Google Analytics, Calendly, and Webhooks to empower your portfolio.",

  // PortfolioStatusCard
  portfolioStatus: "Portfolio Status",
  statusLive: "Live",
  statusOffline: "Offline",
  portfolioPublic: "Your portfolio website can currently be visited by the public.",
  portfolioHidden: "Your website is currently hidden from the public.",
  emailNotVerified: "Email Not Verified",
  emailNotVerifiedDesc: "You cannot make your portfolio public (Live) before verifying your email.",
  resendEmail: "Resend Email",
  sending: "Sending...",

  // EmailCredentialCard
  emailCredential: "Email Credential",
  emailCredentialDesc: "The primary email address linked to your Portfo.be account.",
  lockedGoogle: "Locked (Google)",
  changeEmail: "Change Email",
  oauthNote: "*This account is linked with Google OAuth credentials. The email cannot be changed.",

  // SecurityCard
  passwordSecurity: "Password Security",
  securityDescGoogle: "Create a password so you can log in manually without always using Google.",
  securityDescNormal: "Change your password regularly to prevent unauthorized access.",
  createLocalPassword: "Create Local Password",
  updatePassword: "Update Password",

  // DangerZoneCard
  dangerZone: "Danger Zone",
  dangerZoneDesc: "This action will permanently delete the account and all works within it.",
  deleteAccount: "Delete Account",
  deletingAccount: "Deleting...",

  // DeleteAccountModal
  deleteAccountTitle: "Delete Account",
  deleteAccountWarn: "The system will <strong>permanently delete all your projects</strong>, along with images, settings, and other linked assets.",
  cannotBeUndone: "This action cannot be undone.",
  verifyEmailLabel: "For verification, type your email <strong>{email}</strong> below:",
  cancel: "Cancel",
  confirmDeleteBtn: "Confirm_Delete",

  // UpdateEmailModal
  changeEmailTitle: "Change Email",
  changeEmailDesc: "Enter your new email address and current password for verification.",
  newEmail: "New Email",
  currentPassword: "Current Password",
  forgotCurrentPassword: "Forgot current password?",
  sendLink: "Send Link",
  done: "Done",

  // UpdatePasswordModal
  createLocalPasswordTitle: "Create Local Password",
  updatePasswordTitle: "Update Password",
  createPasswordDesc: "Create a password so you can log in using this email without going through Google.",
  updatePasswordDesc: "Make sure your new password is unique and secure.",
  newPassword: "New Password",
  confirmPassword: "Confirm Password",
  savePassword: "Save Password",

  // BillingContent
  billingTitle: "Billing & Subscription",
  billingDesc: "Manage account plans, monitor remaining days, and download transaction history.",
  newUserGift: "New User Gift",
  tryProFree: "Try PRO Free for 14 Days!",
  tryProDesc: "Unlock all limits for themes, analytics, and projects. No credit card required.",
  claimTrialNow: "Claim Trial Now",
  currentPlan: "Current Plan",
  starter: "Starter",
  active: "Active",
  remainingDays: "Remaining Days",
  lifetime: "Lifetime ♾️",
  days: "{count} Days",
  expiringSoon: "Expiring Soon",
  expiresOn: "Expires On",
  forever: "Forever",
  billingCycleStart: "Billing Cycle (Start)",
  freePlanDesc: "You are using the free plan. Upgrade to PRO to unlock access to all themes, advanced analytics, and remove project limits.",
  projectsLimit: "5 Projects Limit",
  limitedThemes: "Limited Themes",
  licenseGrantedBy: "License granted by:",
  systemAdmin: "System Admin",
  extendPlan: "Extend {plan}",
  noMonthlyFees: "No monthly fees.",
  upgradeToPro: "Upgrade to PRO",
  memberSince: "Member Since",
  connectedPlatforms: "Connected Platforms",
  subscriptionHistory: "Subscription History",
  invoicesTransactions: "Invoices & Transactions",
  noSubHistory: "No subscription history recorded yet.",
  noTxHistory: "No transaction history.",
  createdAt: "Created At",
  freeGranted: "Free / Granted",
  receipt: "Receipt",

  // Trial Modal
  specialOffer: "Special Offer",
  claim14DaysTrial: "Claim 14 Days Trial",
  trialDesc: "Unlock all features without limits. No credit card required. 100% Free during the trial period.",
  deepAnalytics: "Deep Analytics",
  deepAnalyticsDesc: "Monitor visitors & portfolio performance.",
  personalDomain: "Personal Custom Domain",
  personalDomainDesc: "Change URL to yourname.com.",
  unlimitedProjects: "Unlimited Projects",
  unlimitedProjectsDesc: "Upload as many works as you want.",
  exclusiveThemes: "Exclusive Themes",
  exclusiveThemesDesc: "Access all premium templates.",
  activating: "Activating...",
  activateNow: "Activate Now",
  welcomePro: "Welcome to PRO! 🎉",
  welcomeProDesc: "Your <strong>PRO Creator 14 Days</strong> plan is now active. You are free to explore all premium features without limits.",
  startUsingPro: "Start Using PRO",
  elevateCareer: "Elevate your professional career with comprehensive tools.",
  haveBillingIssues: "Have billing issues?",
  billingSupport: "Our support team is ready to help with questions about upgrades, payments, or extensions.",
  contactSupport: "Contact Support"
};

id.DashboardSettings = {
  settingsBadge: "Pengaturan",
  pageTitle: "Pengaturan",
  pageDesc: "Kelola akun, keamanan, tagihan, dan integrasi dari satu tempat.",
  tabAccount: "Akun & Keamanan",
  tabBilling: "Tagihan & Langganan",
  tabIntegrations: "Integrasi",
  tabSoon: "Segera",
  loadingSettings: "Memuat pengaturan...",
  comingSoonTitle: "Segera Hadir",
  comingSoonDesc: "Hubungkan layanan pihak ketiga seperti Google Analytics, Calendly, dan Webhooks untuk memberdayakan portofolio Anda.",
  portfolioStatus: "Status Portofolio",
  statusLive: "Live",
  statusOffline: "Offline",
  portfolioPublic: "Website portofolio Anda saat ini dapat dikunjungi oleh publik.",
  portfolioHidden: "Website Anda saat ini tersembunyi dari publik.",
  emailNotVerified: "Email Belum Terverifikasi",
  emailNotVerifiedDesc: "Anda tidak dapat mempublikasikan portofolio (Live) sebelum memverifikasi email.",
  resendEmail: "Kirim Ulang Email",
  sending: "Mengirim...",
  emailCredential: "Kredensial Email",
  emailCredentialDesc: "Alamat email utama yang terhubung ke akun Portfo.be Anda.",
  lockedGoogle: "Terkunci (Google)",
  changeEmail: "Ubah Email",
  oauthNote: "*Akun ini terhubung dengan kredensial Google OAuth. Email tidak dapat diubah.",
  passwordSecurity: "Keamanan Kata Sandi",
  securityDescGoogle: "Buat kata sandi agar Anda bisa login manual tanpa selalu menggunakan Google.",
  securityDescNormal: "Ubah kata sandi Anda secara berkala untuk mencegah akses tidak sah.",
  createLocalPassword: "Buat Kata Sandi Lokal",
  updatePassword: "Perbarui Kata Sandi",
  dangerZone: "Zona Bahaya",
  dangerZoneDesc: "Tindakan ini akan menghapus akun secara permanen beserta semua karya di dalamnya.",
  deleteAccount: "Hapus Akun",
  deletingAccount: "Menghapus...",
  deleteAccountTitle: "Hapus Akun",
  deleteAccountWarn: "Sistem akan <strong>menghapus semua proyek Anda secara permanen</strong>, termasuk gambar, pengaturan, dan aset terkait lainnya.",
  cannotBeUndone: "Tindakan ini tidak dapat dibatalkan.",
  verifyEmailLabel: "Untuk verifikasi, ketik email Anda <strong>{email}</strong> di bawah:",
  cancel: "Batal",
  confirmDeleteBtn: "Konfirmasi_Hapus",
  changeEmailTitle: "Ubah Email",
  changeEmailDesc: "Masukkan alamat email baru dan kata sandi saat ini untuk verifikasi.",
  newEmail: "Email Baru",
  currentPassword: "Kata Sandi Saat Ini",
  forgotCurrentPassword: "Lupa kata sandi saat ini?",
  sendLink: "Kirim Tautan",
  done: "Selesai",
  createLocalPasswordTitle: "Buat Kata Sandi Lokal",
  updatePasswordTitle: "Perbarui Kata Sandi",
  createPasswordDesc: "Buat kata sandi agar Anda bisa login menggunakan email ini tanpa melalui Google.",
  updatePasswordDesc: "Pastikan kata sandi baru Anda unik dan aman.",
  newPassword: "Kata Sandi Baru",
  confirmPassword: "Konfirmasi Kata Sandi",
  savePassword: "Simpan Kata Sandi",
  billingTitle: "Tagihan & Langganan",
  billingDesc: "Kelola paket akun, pantau sisa hari, dan unduh riwayat transaksi.",
  newUserGift: "Hadiah Pengguna Baru",
  tryProFree: "Coba PRO Gratis selama 14 Hari!",
  tryProDesc: "Buka semua batasan untuk tema, analitik, dan proyek. Tanpa kartu kredit.",
  claimTrialNow: "Klaim Trial Sekarang",
  currentPlan: "Paket Saat Ini",
  starter: "Pemula",
  active: "Aktif",
  remainingDays: "Sisa Hari",
  lifetime: "Selamanya ♾️",
  days: "{count} Hari",
  expiringSoon: "Segera Berakhir",
  expiresOn: "Berakhir Pada",
  forever: "Selamanya",
  billingCycleStart: "Siklus Tagihan (Mulai)",
  freePlanDesc: "Anda menggunakan paket gratis. Tingkatkan ke PRO untuk membuka akses ke semua tema, analitik lanjutan, dan hapus batasan proyek.",
  projectsLimit: "Batas 5 Proyek",
  limitedThemes: "Tema Terbatas",
  licenseGrantedBy: "Lisensi diberikan oleh:",
  systemAdmin: "Admin Sistem",
  extendPlan: "Perpanjang {plan}",
  noMonthlyFees: "Tanpa biaya bulanan.",
  upgradeToPro: "Tingkatkan ke PRO",
  memberSince: "Anggota Sejak",
  connectedPlatforms: "Platform Terhubung",
  subscriptionHistory: "Riwayat Langganan",
  invoicesTransactions: "Invoice & Transaksi",
  noSubHistory: "Belum ada riwayat langganan.",
  noTxHistory: "Belum ada riwayat transaksi.",
  createdAt: "Dibuat Pada",
  freeGranted: "Gratis / Diberikan",
  receipt: "Kuitansi",
  specialOffer: "Penawaran Spesial",
  claim14DaysTrial: "Klaim Trial 14 Hari",
  trialDesc: "Buka semua fitur tanpa batas. Tanpa kartu kredit. 100% Gratis selama periode trial.",
  deepAnalytics: "Analitik Mendalam",
  deepAnalyticsDesc: "Pantau pengunjung & performa portofolio.",
  personalDomain: "Domain Kustom Pribadi",
  personalDomainDesc: "Ubah URL ke namamu.com.",
  unlimitedProjects: "Proyek Tanpa Batas",
  unlimitedProjectsDesc: "Unggah karya sebanyak yang kamu mau.",
  exclusiveThemes: "Tema Eksklusif",
  exclusiveThemesDesc: "Akses semua template premium.",
  activating: "Mengaktifkan...",
  activateNow: "Aktifkan Sekarang",
  welcomePro: "Selamat datang di PRO! 🎉",
  welcomeProDesc: "Paket <strong>PRO Creator 14 Hari</strong> Anda sekarang aktif. Anda bebas menjelajahi semua fitur premium tanpa batas.",
  startUsingPro: "Mulai Gunakan PRO",
  elevateCareer: "Tingkatkan karir profesional Anda dengan perangkat komprehensif.",
  haveBillingIssues: "Ada masalah tagihan?",
  billingSupport: "Tim dukungan kami siap membantu pertanyaan tentang peningkatan, pembayaran, atau perpanjangan.",
  contactSupport: "Hubungi Dukungan"
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('messages/id.json', JSON.stringify(id, null, 2), 'utf8');
console.log("✓ Dictionaries updated with DashboardSettings");

// ══════════════════════════════════════════════════════════════════════════════
// STEP 2: Migrate files
// ══════════════════════════════════════════════════════════════════════════════

function addImport(code) {
  if (code.includes("useTranslations")) return code;
  const lastIdx = code.lastIndexOf("\\nimport ");
  // Simpler: add after all imports
  const lines = code.split('\\n');
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith('import ')) lastImportLine = i;
  }
  if (lastImportLine >= 0) {
    lines.splice(lastImportLine + 1, 0, "import { useTranslations } from 'next-intl';");
  }
  return lines.join('\\n');
}

// Actually let's use a simpler split/join approach
function migrateFile(filePath, ns, replacements) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Add import
  if (!code.includes("useTranslations")) {
    const lines = code.split('\n');
    let lastImportLine = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trimStart().startsWith('import ')) lastImportLine = i;
    }
    if (lastImportLine >= 0) {
      lines.splice(lastImportLine + 1, 0, "import { useTranslations } from 'next-intl';");
      code = lines.join('\n');
    }
  }
  
  // Add hook - find first 'export function' or 'export default function' and add after opening brace
  for (const fnName of (replacements._hookFns || [])) {
    const regex = new RegExp(`(export (?:default )?function ${fnName}\\([^)]*\\)\\s*\\{)`);
    if (regex.test(code) && !code.match(new RegExp(`function ${fnName}[^]*?useTranslations`))) {
      code = code.replace(regex, `$1\n  const t = useTranslations('${ns}');`);
    }
  }
  
  // Apply string replacements
  for (const [from, to] of Object.entries(replacements)) {
    if (from.startsWith('_')) continue; // skip metadata
    code = code.replace(new RegExp(from, 'g'), to);
  }
  
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`✓ Migrated ${filePath}`);
}

// ── Settings Page ──
migrateFile('app/(dashboard)/dashboard/settings/page.tsx', 'DashboardSettings', {
  _hookFns: ['SettingsContent'],
  ">Settings<\\/span>": ">{t('settingsBadge')}</span>",
  ">\\s*Settings\\s*<\\/h1>": ">{t('pageTitle')}</h1>",
  ">Manage account, security, billing, and integrations from one place\\.<": ">{t('pageDesc')}<",
  "label: 'Account & Security'": "label: t('tabAccount')",
  "label: 'Billing & Subscription'": "label: t('tabBilling')",
  "label: 'Integrations'": "label: t('tabIntegrations')",
  ">Soon<": ">{t('tabSoon')}<",
  ">Coming Soon<\\/h3>": ">{t('comingSoonTitle')}</h3>",
  ">Connect third-party services like Google Analytics, Calendly, and Webhooks to empower your portfolio\\.<": ">{t('comingSoonDesc')}<",
  ">Loading settings\\.\\.\\.<": ">{t('loadingSettings')}<",
});

// ── PortfolioStatusCard ──
migrateFile('src/features/settings/ui/PortfolioStatusCard.tsx', 'DashboardSettings', {
  _hookFns: ['PortfolioStatusCard'],
  ">Portfolio Status<": ">{t('portfolioStatus')}<",
  "> Live<": "> {t('statusLive')}<",
  "> Offline<": "> {t('statusOffline')}<",
  '"Your portfolio website can currently be visited by the public\\."': "t('portfolioPublic')",
  '"Your website is currently hidden from the public\\."': "t('portfolioHidden')",
  ">Email Not Verified<": ">{t('emailNotVerified')}<",
  ">You cannot make your portfolio public \\(Live\\) before verifying your email\\.<": ">{t('emailNotVerifiedDesc')}<",
  "'Resend Email'": "t('resendEmail')",
  ">Sending\\.\\.\\.<": ">{t('sending')}<",
});

// ── EmailCredentialCard ──
migrateFile('src/features/settings/ui/EmailCredentialCard.tsx', 'DashboardSettings', {
  _hookFns: ['EmailCredentialCard'],
  ">Email Credential<": ">{t('emailCredential')}<",
  ">The primary email address linked to your Portfo\\.be account\\.<": ">{t('emailCredentialDesc')}<",
  ">Locked \\(Google\\)<": ">{t('lockedGoogle')}<",
  "'Change Email'": "t('changeEmail')",
  ">\\*This account is linked with Google OAuth credentials\\. The email cannot be changed\\.<": ">{t('oauthNote')}<",
});

// ── SecurityCard ──
migrateFile('src/features/settings/ui/SecurityCard.tsx', 'DashboardSettings', {
  _hookFns: ['SecurityCard'],
  ">Password Security<": ">{t('passwordSecurity')}<",
  '"Create a password so you can log in manually without always using Google\\."': "t('securityDescGoogle')",
  '"Change your password regularly to prevent unauthorized access\\."': "t('securityDescNormal')",
  "'Create Local Password'": "t('createLocalPassword')",
  "'Update Password'": "t('updatePassword')",
});

// ── DangerZoneCard ──
migrateFile('src/features/settings/ui/DangerZoneCard.tsx', 'DashboardSettings', {
  _hookFns: ['DangerZoneCard'],
  ">Danger Zone<": ">{t('dangerZone')}<",
  ">This action will permanently delete the account and all works within it\\.<": ">{t('dangerZoneDesc')}<",
  "'Deleting\\.\\.\\.'": "t('deletingAccount')",
  "'Delete Account'": "t('deleteAccount')",
});

// ── DeleteAccountModal ──
migrateFile('src/features/settings/ui/DeleteAccountModal.tsx', 'DashboardSettings', {
  _hookFns: ['DeleteAccountModal'],
  ">Delete Account<\\/h3>": ">{t('deleteAccountTitle')}</h3>",
  ">\\s*Cancel\\s*<\\/button>": ">{t('cancel')}</button>",
  "'Confirm_Delete'": "t('confirmDeleteBtn')",
  ">\\s*This action cannot be undone\\.": ">{t('cannotBeUndone')}",
});

// ── UpdateEmailModal ──
migrateFile('src/features/settings/ui/UpdateEmailModal.tsx', 'DashboardSettings', {
  _hookFns: ['UpdateEmailModal'],
  ">Change Email<\\/h3>": ">{t('changeEmailTitle')}</h3>",
  ">Enter your new email address and current password for verification\\.<": ">{t('changeEmailDesc')}<",
  ">New Email<": ">{t('newEmail')}<",
  ">Current Password<": ">{t('currentPassword')}<",
  ">\\s*Forgot current password\\?\\s*<": ">{t('forgotCurrentPassword')}<",
  "'Send Link'": "t('sendLink')",
  ">Cancel<\\/button>": ">{t('cancel')}</button>",
  ">\\s*Done\\s*<\\/button>": ">{t('done')}</button>",
});

// ── UpdatePasswordModal ──
migrateFile('src/features/settings/ui/UpdatePasswordModal.tsx', 'DashboardSettings', {
  _hookFns: ['UpdatePasswordModal'],
  '"Create Local Password"': 't("createLocalPasswordTitle")',
  '"Update Password"': 't("updatePasswordTitle")',
  '"Create a password so you can log in using this email without going through Google\\."': "t('createPasswordDesc')",
  '"Make sure your new password is unique and secure\\."': "t('updatePasswordDesc')",
  ">Current Password<": ">{t('currentPassword')}<",
  ">\\s*Forgot current password\\?\\s*<": ">{t('forgotCurrentPassword')}<",
  ">New Password<": ">{t('newPassword')}<",
  ">Confirm Password<": ">{t('confirmPassword')}<",
  "'Save Password'": "t('savePassword')",
  ">Cancel<\\/button>": ">{t('cancel')}</button>",
  ">\\s*Done\\s*<\\/button>": ">{t('done')}</button>",
});

// ── BillingContent ──
migrateFile('src/features/settings/ui/BillingContent.tsx', 'DashboardSettings', {
  _hookFns: ['BillingContent'],
  ">Billing & Subscription<\\/h1>": ">{t('billingTitle')}</h1>",
  ">\\s*Manage account plans, monitor remaining days, and download transaction history\\.\\s*<": ">{t('billingDesc')}<",
  "> New User Gift<": "> {t('newUserGift')}<",
  ">Try PRO Free for 14 Days!<": ">{t('tryProFree')}<",
  ">Unlock all limits for themes, analytics, and projects\\. No credit card required\\.<": ">{t('tryProDesc')}<",
  ">\\s*Claim Trial Now\\s*<": ">{t('claimTrialNow')}<",
  ">Current Plan<": ">{t('currentPlan')}<",
  '>"Starter"': ">t('starter')",
  "> Active<": "> {t('active')}<",
  ">Remaining Days<": ">{t('remainingDays')}<",
  ">Lifetime ♾️<": ">{t('lifetime')}<",
  ">Expiring Soon<": ">{t('expiringSoon')}<",
  ">Expires On<": ">{t('expiresOn')}<",
  ">'Forever'": ">t('forever')",
  ">Billing Cycle \\(Start\\)<": ">{t('billingCycleStart')}<",
  ">\\s*You are using the free plan\\. Upgrade to PRO to unlock access to all themes, advanced analytics, and remove project limits\\.\\s*<": ">{t('freePlanDesc')}<",
  'label: "5 Projects Limit"': "label: t('projectsLimit')",
  'label: "Limited Themes"': "label: t('limitedThemes')",
  ">No monthly fees\\.<": ">{t('noMonthlyFees')}<",
  ">Upgrade to PRO<": ">{t('upgradeToPro')}<",
  ">Member Since<": ">{t('memberSince')}<",
  ">Connected Platforms<": ">{t('connectedPlatforms')}<",
  '"Subscription History"': "t('subscriptionHistory')",
  '"Invoices & Transactions"': "t('invoicesTransactions')",
  '"No subscription history recorded yet\\."': "t('noSubHistory')",
  '"No transaction history\\."': "t('noTxHistory')",
  ">Created At<": ">{t('createdAt')}<",
  ">Free \\/ Granted<": ">{t('freeGranted')}<",
  ">Receipt<": ">{t('receipt')}<",
  "> Special Offer<": "> {t('specialOffer')}<",
  ">Claim 14 Days Trial<": ">{t('claim14DaysTrial')}<",
  ">Unlock all features without limits\\. No credit card required\\. 100% Free during the trial period\\.<": ">{t('trialDesc')}<",
  'title: "Deep Analytics"': "title: t('deepAnalytics')",
  'desc: "Monitor visitors & portfolio performance\\."': "desc: t('deepAnalyticsDesc')",
  'title: "Personal Custom Domain"': "title: t('personalDomain')",
  'desc: "Change URL to yourname\\.com\\."': "desc: t('personalDomainDesc')",
  'title: "Unlimited Projects"': "title: t('unlimitedProjects')",
  'desc: "Upload as many works as you want\\."': "desc: t('unlimitedProjectsDesc')",
  'title: "Exclusive Themes"': "title: t('exclusiveThemes')",
  'desc: "Access all premium templates\\."': "desc: t('exclusiveThemesDesc')",
  "> Activating\\.\\.\\.<": "> {t('activating')}<",
  ">Activate Now<": ">{t('activateNow')}<",
  ">Welcome to PRO! 🎉<": ">{t('welcomePro')}<",
  ">\\s*Start Using PRO\\s*<": ">{t('startUsingPro')}<",
  ">\\s*Cancel\\s*<\\/button>": ">{t('cancel')}</button>",
  ">Elevate your professional career with comprehensive tools\\.<": ">{t('elevateCareer')}<",
  ">Have billing issues\\?<": ">{t('haveBillingIssues')}<",
  ">\\s*Our support team is ready to help with questions about upgrades, payments, or extensions\\.\\s*<": ">{t('billingSupport')}<",
  ">\\s*Contact Support\\s*<": ">{t('contactSupport')}<",
});

console.log("\\n=== Phase 3 Settings migration complete ===");
