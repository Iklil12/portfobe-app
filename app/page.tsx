import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { TemplatesSection } from '@/components/sections/TemplatesSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { FaqSection } from '@/components/sections/FaqSection';

export default async function LandingPage() {
  // Cek sesi di server — tanpa memanggil API apapun dari client
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  return (
    <div className="text-slate-900 bg-[#FAFAFA] font-sans selection:bg-[#ff9e00]/30 selection:text-slate-900 overflow-x-hidden">
      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <TemplatesSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </div>
  );
}