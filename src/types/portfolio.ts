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

/** A single headline number shown under the project goal. */
export interface ProjectMetric {
  value: string;
  label: string;
}

/** An image shown in the case-study gallery / lightbox. */
export interface ProjectMedia {
  src: string;
  alt: string;
}

/**
 * Case-study contract.
 *
 * Copy is intentionally short: `goal` is the single statement a reader should
 * remember, `challenge` / `approach` / `outcome` replace the old long-form
 * overview/problem/solution/results blocks, and `metrics` carry the numbers
 * that used to be buried in prose.
 */
export interface Project {
  id: string;
  title: string;
  /** One sentence used on cards and in SEO descriptions (80–155 chars). */
  shortDescription: string;
  year: string;
  /** Short type shown on cards: Work, Freelance, Personal, Study. */
  category: string;
  /** Discipline or industry, shown in the at-a-glance column. */
  sector: string;
  client?: string;
  location?: string;
  timeline?: string;
  platform?: string;
  role?: string;
  /** One large statement: the goal of the collaboration. */
  goal: string;
  /** One-sentence standfirst shown under the "Goal of the collaboration" heading. */
  brief: string;
  challenge: string;
  /** Exactly three short, scannable actions. */
  approach: string[];
  outcome: string;
  /** Exactly three metrics. */
  metrics: ProjectMetric[];
  gallery?: ProjectMedia[];
  techStack: string[];
  imageUrl: string;
  thumbnailImageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}
