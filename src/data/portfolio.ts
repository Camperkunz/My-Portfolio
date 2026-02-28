import { Experience, Education, SkillGroup, Project } from "@/types/portfolio";

export const personalInfo = {
  name: "Anna Nikiforova",
  title: "Frontend Developer",
  tagline: "Building clean, performant interfaces with modern web technologies.",
  github: "https://github.com/Camperkunz",
  linkedin: "https://www.linkedin.com/in/anna-nikiforova-ac/",
  email: "anyanikiforova04@gmail.com",
  logo: '/favicon.png'
};

export const experiences: Experience[] = [
  {
    company: "Acme Corp",
    role: "Senior Frontend Developer",
    period: "2022 — Present",
    description:
      "Led migration from legacy jQuery codebase to React. Built a component library used across 4 product teams. Reduced bundle size by 40%.",
  },
  {
    company: "StartupXYZ",
    role: "Frontend Developer",
    period: "2020 — 2022",
    description:
      "Developed customer-facing dashboard with real-time data visualization. Implemented CI/CD pipelines and automated testing.",
  },
  {
    company: "Freelance",
    role: "Web Developer",
    period: "2018 — 2020",
    description:
      "Built responsive websites and web apps for small businesses. Focused on performance, accessibility, and SEO.",
  },
];

export const educations: Education[] = [
  {
    institution: "University of Technology",
    degree: "B.Sc. Computer Science",
    period: "2014 — 2018",
  },
  {
    institution: "Online Academy",
    degree: "Advanced React & TypeScript Certificate",
    period: "2021",
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Task Manager",
    shortDescription: "A kanban-style task management app with drag-and-drop.",
    fullDescription:
      "Full-featured task management application with drag-and-drop kanban boards, user authentication, real-time collaboration, and dark mode support. Built with React and a Node.js backend.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "2",
    title: "Weather Dashboard",
    shortDescription: "Real-time weather data with interactive charts.",
    fullDescription:
      "Weather dashboard that displays real-time forecasts, historical trends, and interactive charts. Integrates with OpenWeatherMap API and supports geolocation.",
    techStack: ["React", "Recharts", "OpenWeatherMap API"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "E-Commerce Store",
    shortDescription: "Minimal storefront with cart and checkout flow.",
    fullDescription:
      "A minimal e-commerce storefront featuring product listings, filtering, cart management, and a mock checkout flow. Fully responsive with optimistic UI updates.",
    techStack: ["Next.js", "Stripe", "Tailwind CSS"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "4",
    title: "Markdown Editor",
    shortDescription: "Live preview markdown editor with syntax highlighting.",
    fullDescription:
      "A split-pane markdown editor with real-time preview, syntax highlighting, and export to PDF. Supports custom themes and keyboard shortcuts.",
    techStack: ["React", "CodeMirror", "Marked"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
  },
  {
    id: "5",
    title: "Portfolio Generator",
    shortDescription: "CLI tool to scaffold developer portfolios.",
    fullDescription:
      "A command-line tool that generates static portfolio websites from a JSON config file. Supports multiple themes and deployment to GitHub Pages.",
    techStack: ["Node.js", "Handlebars", "CLI"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
  },
];
