import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { EnterpriseHeroSection } from '@/components/sections/EnterpriseHeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { SyncEngineSection } from '@/components/sections/SyncEngineSection';
import { DeviceResizerSection } from '@/components/sections/DeviceResizerSection';
import { TemplatesSection } from '@/components/sections/TemplatesSection';
import { FaqSection } from '@/components/sections/FaqSection';

export default function LandingPage() {
  return (
    <div className="text-white bg-[#050505] font-sans selection:bg-[#ff9e00]/30 selection:text-white overflow-x-clip w-full relative">
      <Navbar isDarkBg={true} />
      <main>
        <HeroSection />
        <EnterpriseHeroSection />
        <FeaturesSection />
        <SyncEngineSection />
        <TemplatesSection />
        <DeviceResizerSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
