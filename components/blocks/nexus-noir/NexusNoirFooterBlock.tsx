import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirFooterBlock({ data, theme, isEditor }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "AURA KINETIC";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const accentColor = theme?.themeColor || '#4F46E5'; 
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <footer id="contact" className="pt-32 pb-10 px-6 mt-20 relative overflow-hidden bg-[#030303] z-20">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] blur-[100px] z-0 pointer-events-none rounded-full opacity-10" style={{ backgroundColor: accentColor }}></div>
            
            <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                <div className={`inline-block border border-white/10 rounded-full px-6 py-2 mb-8 ${isEditor ? '' : 'gs-reveal'}`}>
                    <span className="w-2 h-2 inline-block rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    <span className="text-xs uppercase tracking-widest text-white">
                        <EditableText entity="appearance" field="nn_footer_status" value={getCustomText('nn_footer_status', 'Open for New Opportunities')} isEditor={isEditor} />
                    </span>
                </div>
                
                <h2 className={`magnetic inline-block font-nn-heading text-6xl md:text-[8vw] font-bold tracking-tighter mb-16 text-white hover:text-[#888888] transition-colors cursor-pointer leading-none ${isEditor ? '' : 'gs-reveal'}`}>
                    <a href={isEditor ? undefined : `mailto:${userEmail}`}>
                        <EditableText entity="appearance" field="nn_footer_cta" value={getCustomText('nn_footer_cta', "Let's Collaborate.")} isEditor={isEditor} />
                    </a>
                </h2>
                
                <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/10 text-sm text-[#888888] gap-6">
                    <div className="flex items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} {fullName}.</p>
                    </div>
                    <div className="flex gap-8">
                        {data?.socials?.map((social: any, i: number) => (
                            <a key={i} href={social.url} target="_blank" rel="noreferrer" className="magnetic hover:text-white transition-colors scramble-link hover-trigger" data-text={social.platform}>{social.platform}</a>
                        ))}
                    </div>
                    <p className="text-xs uppercase tracking-widest">
                        <EditableText entity="appearance" field="nn_footer_location" value={getCustomText('nn_footer_location', 'Global')} isEditor={isEditor} />
                    </p>
                </div>
            </div>
        </footer>
    );
}
