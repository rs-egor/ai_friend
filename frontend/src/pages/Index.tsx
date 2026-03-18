import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ForWhomSection from "@/components/landing/ForWhomSection";
import MemorySection from "@/components/landing/MemorySection";
import CreateFriendSection from "@/components/landing/CreateFriendSection";
import LetterSection from "@/components/landing/LetterSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SafetySection from "@/components/landing/SafetySection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (isAuthenticated) {
      navigate("/friends");
    } else {
      navigate("/register");
    }
  };

  return (
    <LanguageProvider>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {isLoading ? null : isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Регистрация</Link>
            </Button>
          </>
        )}
      </div>
      <LanguageSwitcher />
      <main className="overflow-x-hidden">
        <HeroSection onGetStarted={handleStartChat} />
        <ProblemSection />
        <ForWhomSection />
        <MemorySection />
        <CreateFriendSection />
        <LetterSection />
        <HowItWorksSection />
        <SafetySection />
        <PricingSection />
        <TestimonialsSection />
        <FinalCTASection />
      </main>
    </LanguageProvider>
  );
};

export default Index;
