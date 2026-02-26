import Layout from "@/components/portfolio/Layout";
import HeroSection from "@/components/portfolio/HeroSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import EducationSection from "@/components/portfolio/EducationSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import FadeInSection from "@/components/portfolio/FadeInSection";

const Index = () => {
  return (
    <Layout>
      <FadeInSection>
        <HeroSection />
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
    </Layout>
  );
};

export default Index;
