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
  description: string[] ;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  details?: string;
  notes?: string;
  techStack: string[];
  imageUrl: string;
  galleryImages?: string[];
  githubUrl?: string;
  liveUrl?: string;
}
