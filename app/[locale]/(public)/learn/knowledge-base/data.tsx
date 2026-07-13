import React from 'react';
import { BookOpen, Settings, Layout, Globe, Activity } from 'lucide-react';

// Import all article content components
import AddingMultipleProjects from './articles/adding-multiple-projects';
import UnderstandingTheDashboard from './articles/understanding-the-dashboard';
import UploadingHighResAssets from './articles/uploading-high-res-assets';
import UnderstandingThemeEditor from './articles/understanding-theme-editor';
import DarkModeVsLightMode from './articles/dark-mode-vs-light-mode';
import CustomFontsIntegration from './articles/custom-fonts-integration';
import HowToConnectCustomDomain from './articles/how-to-connect-custom-domain';
import FreeSslCertificates from './articles/free-ssl-certificates';
import SettingUpGoogleAnalytics from './articles/setting-up-google-analytics';
import MetaTagsAndOgImages from './articles/meta-tags-and-og-images';
import BillingCycleAndInvoices from './articles/billing-cycle-and-invoices';
import CancelOrPauseSubscription from './articles/cancel-or-pause-subscription';

export const CATEGORIES = [
    { id: 'getting-started', name: 'GETTING STARTED', icon: BookOpen },
    { id: 'account-billing', name: 'ACCOUNT & BILLING', icon: Settings },
    { id: 'themes', name: 'THEMES & CUSTOMIZATION', icon: Layout },
    { id: 'domains', name: 'CUSTOM DOMAINS', icon: Globe },
    { id: 'seo', name: 'SEO & ANALYTICS', icon: Activity },
];

export const ALL_ARTICLES = [
    {
        id: 'adding-multiple-projects',
        title: 'Adding and organizing multiple projects',
        categoryId: 'getting-started',
        category: 'GETTING STARTED',
        date: '01 JUN 2026',
        views: '15.9K',
        description: 'Best practices for categorizing and displaying your work to attract high-paying clients.',
        content: <AddingMultipleProjects />
    },
    {
        id: 'understanding-the-dashboard',
        title: 'Navigating the Portfo.be Dashboard',
        categoryId: 'getting-started',
        category: 'GETTING STARTED',
        date: '02 JUN 2026',
        views: '10.2K',
        description: 'A complete walkthrough of the main dashboard, analytics, and project management tools.',
        content: <UnderstandingTheDashboard />
    },
    {
        id: 'uploading-high-res-assets',
        title: 'Uploading High-Resolution Assets',
        categoryId: 'getting-started',
        category: 'GETTING STARTED',
        date: '05 JUN 2026',
        views: '8.4K',
        description: 'How to compress and upload videos and images without losing quality.',
        content: <UploadingHighResAssets />
    },
    {
        id: 'understanding-theme-editor',
        title: 'Understanding the Theme Editor layout system',
        categoryId: 'themes',
        category: 'THEMES & CUSTOMIZATION',
        date: '10 JUN 2026',
        views: '8.2K',
        description: 'Learn how to use the advanced theme editor to customize spacing, typography, and colors.',
        content: <UnderstandingThemeEditor />
    },
    {
        id: 'dark-mode-vs-light-mode',
        title: 'Forcing Dark Mode vs Light Mode',
        categoryId: 'themes',
        category: 'THEMES & CUSTOMIZATION',
        date: '11 JUN 2026',
        views: '6.1K',
        description: 'How to lock your portfolio into a specific color scheme regardless of the user\'s OS preference.',
        content: <DarkModeVsLightMode />
    },
    {
        id: 'custom-fonts-integration',
        title: 'Uploading Custom Web Fonts',
        categoryId: 'themes',
        category: 'THEMES & CUSTOMIZATION',
        date: '15 JUN 2026',
        views: '4.8K',
        description: 'Step-by-step guide to importing TTF/WOFF files or syncing with Adobe Fonts.',
        content: <CustomFontsIntegration />
    },
    {
        id: 'how-to-connect-custom-domain',
        title: 'How to connect a custom domain',
        categoryId: 'domains',
        category: 'CUSTOM DOMAINS',
        date: '12 JUN 2026',
        views: '12.4K',
        description: 'A step-by-step guide to pointing your A and CNAME records to Portfo.be servers.',
        content: <HowToConnectCustomDomain />
    },
    {
        id: 'free-ssl-certificates',
        title: 'Automatic SSL Provisioning',
        categoryId: 'domains',
        category: 'CUSTOM DOMAINS',
        date: '14 JUN 2026',
        views: '5.5K',
        description: 'Understanding how Let\'s Encrypt secures your custom domain automatically.',
        content: <FreeSslCertificates />
    },
    {
        id: 'setting-up-google-analytics',
        title: 'Setting up Google Analytics (GA4)',
        categoryId: 'seo',
        category: 'SEO & ANALYTICS',
        date: '05 JUN 2026',
        views: '5.1K',
        description: 'Track your visitors and page views by integrating your GA4 Measurement ID.',
        content: <SettingUpGoogleAnalytics />
    },
    {
        id: 'meta-tags-and-og-images',
        title: 'Configuring Meta Tags & OG Images',
        categoryId: 'seo',
        category: 'SEO & ANALYTICS',
        date: '08 JUN 2026',
        views: '7.3K',
        description: 'How to make your portfolio look great when shared on Twitter, LinkedIn, and WhatsApp.',
        content: <MetaTagsAndOgImages />
    },
    {
        id: 'billing-cycle-and-invoices',
        title: 'Understanding your billing cycle',
        categoryId: 'account-billing',
        category: 'ACCOUNT & BILLING',
        date: '20 MAY 2026',
        views: '3.2K',
        description: 'Where to find your tax invoices and how prorated upgrades work.',
        content: <BillingCycleAndInvoices />
    },
    {
        id: 'cancel-or-pause-subscription',
        title: 'How to pause your Pro subscription',
        categoryId: 'account-billing',
        category: 'ACCOUNT & BILLING',
        date: '22 MAY 2026',
        views: '4.1K',
        description: 'Temporarily freeze your account without losing your uploaded assets.',
        content: <CancelOrPauseSubscription />
    }
];
