import Layout from "@/components/portfolio/Layout";
// 
import HeroSection from "@/components/portfolio/sections/HeroSection";
import AboutSection from "@/components/portfolio/sections/AboutSection";
import ExperienceSection from "@/components/portfolio/sections/ExperienceSection";
import EducationSection from "@/components/portfolio/sections/EducationSection";
import SkillsSection from "@/components/portfolio/sections/SkillsSection";
import ProjectsSection from "@/components/portfolio/sections/ProjectsSection";
import ContactSection from "@/components/portfolio/sections/ContactSection";
import FadeInSection from "@/components/portfolio/animations/FadeInSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FadeInSection>
        <AboutSection />
      </FadeInSection>
      <FadeInSection>
        <SkillsSection />
      </FadeInSection>
      <FadeInSection>
        <ProjectsSection />
      </FadeInSection>
      <FadeInSection>
        <ExperienceSection />
      </FadeInSection>
      <FadeInSection>
        <EducationSection />
      </FadeInSection>
      <FadeInSection>
        <ContactSection />
      </FadeInSection>
    </Layout>
  );
};

export default Index;
