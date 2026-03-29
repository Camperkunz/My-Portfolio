import Layout from "@/components/portfolio/Layout";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import EducationSection from "@/components/portfolio/EducationSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import FadeInSection from "@/components/portfolio/FadeInSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FadeInSection>
        <AboutSection />
      </FadeInSection>
      <FadeInSection>
        <ExperienceSection />
      </FadeInSection>
      <FadeInSection>
        <EducationSection />
      </FadeInSection>
      <FadeInSection>
        <SkillsSection />
      </FadeInSection>
      <FadeInSection>
        <ProjectsSection />
      </FadeInSection>
      <FadeInSection>
        <ContactSection />
      </FadeInSection>
    </Layout>
  );
};

export default Index;
