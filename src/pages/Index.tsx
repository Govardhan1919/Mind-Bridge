import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection, FeaturesSection, CTASection } from "@/components/HomeSections";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
