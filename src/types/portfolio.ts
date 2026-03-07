export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ContentBlock {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  year: string;
  category: string;
  highlights: string[];
  problem?: string;
  problemImageUrl?: string;
  solution?: string;
  solutionImageUrl?: string;
  implementation?: string;
  implementationImageUrl?: string;
  results?: string;
  resultsImageUrl?: string;
  techStack: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}
