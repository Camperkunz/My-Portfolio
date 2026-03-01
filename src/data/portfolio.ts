import { Experience, Education, Project } from "@/types/portfolio";

export const personalInfo = {
  name: "Anna Nikiforova",
  title: "Frontend Developer",
  tagline: "Building clean, performant interfaces with modern web technologies.",
  github: "https://github.com/Camperkunz",
  linkedin: "https://www.linkedin.com/in/anna-nikiforova-ac/",
  email: "anyanikiforova04@gmail.com",
  phone: "+1 (613) 555-0123",
  city: "Ottawa, ON",
  address: "123 Rideau St, Ottawa, ON K1N 5Y3, Canada",
  logo: '/favicon.png'
};

export const experiences: Experience[] = [
  {
    company: "Algonquin College",
    role: "Web Developer & UX Designer",
    period: "Jan 2026 — Present",
    description: [
      "Built and designed a React website based on analytical report data from 10+ Canadian universities and colleges.",
      "Developed custom React components and responsive UI with modern frontend practices.",
      "Used Lovable and other AI tools for rapid prototyping and workflow optimization.",
      "Deployed and managed the project on AWS cloud infrastructure.",
      "Designed typography, branding systems, and print assets for large-scale events in Ottawa."
    ],
  },
  {
    company: "Unque",
    role: "Junior Web Developer",
    period: "Aug 2024 — Sep 2025",
    description: [
      "Built and launched a complete Shopify e-commerce website, including storefront architecture and product pages.",
      "Customized Shopify themes using Liquid, HTML, and CSS.",
      "Migrated the full product catalog from social media to Shopify with structured categorization and consistent branding.",
      "Implemented on-page SEO: keyword-optimized titles, meta descriptions, alt tags and structured product content."
    ],
  },
  {
    company: "The Canadian Association of Occupational Therapists (CAOT)",
    role: "Interactive Media Designer (Co-op)",
    period: "May 2025 — Aug 2025",
    description: [
      "Designed and launched two marketing websites.",
      "Created accessible, user-centered layouts and interactive prototypes in Figma following WCAG and CAOT accessibility guidelines.",
      "Customized Squarespace templates using HTML, CSS, and JavaScript to extend core functionality.",
      "Refined UI components to improve usability, accessibility, and content structure."
    ],
  },
];

export const educations: Education[] = [
  {
    institution: "Algonquin College of Applied Arts and Technology",
    degree: "Interactive Media Design",
    period: "Jan 2024 - Jan 2026",
    description: [
      "Worked with HTML, CSS, JavaScript and modern frameworks (Vue, React, Angular).",
      "Designed UI/UX prototypes in Figma and Adobe Creative Suite.",
      "Used Git and GitHub for version control and collaborative development.",
      "Built responsive, user-centered web interfaces through team-based projects."
    ]
  },
  {
    institution: "A. G. Pozdeev Art School",
    degree: "Fine/Studio Arts, General",
    period: "Feb 2019 — May 2022",
    description: [
      "Designed and developed a web platform based on a comprehensive report",
      "Integrated data from over 10 universities and colleges across Canada",
      "Worked closely with stakeholders to refine UX/UI"
    ],
    
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Task Manager",
    shortDescription: "A kanban-style task management app with drag-and-drop.",
    fullDescription:
      "Full-featured task management application with drag-and-drop kanban boards, user authentication, real-time collaboration, and dark mode support. Built with React and a Node.js backend.",
    details: "",
    notes: "",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    imageUrl: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "2",
    title: "Weather Dashboard",
    shortDescription: "Real-time weather data with interactive charts.",
    fullDescription:
      "Weather dashboard that displays real-time forecasts, historical trends, and interactive charts. Integrates with OpenWeatherMap API and supports geolocation.",
    details: "",
    notes: "",
    techStack: ["React", "Recharts", "OpenWeatherMap API"],
    imageUrl: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg"],
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "E-Commerce Store",
    shortDescription: "Minimal storefront with cart and checkout flow.",
    fullDescription:
      "A minimal e-commerce storefront featuring product listings, filtering, cart management, and a mock checkout flow. Fully responsive with optimistic UI updates.",
    details: "",
    notes: "",
    techStack: ["Next.js", "Stripe", "Tailwind CSS"],
    imageUrl: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "4",
    title: "Markdown Editor",
    shortDescription: "Live preview markdown editor with syntax highlighting.",
    fullDescription:
      "A split-pane markdown editor with real-time preview, syntax highlighting, and export to PDF. Supports custom themes and keyboard shortcuts.",
    details: "",
    notes: "",
    techStack: ["React", "CodeMirror", "Marked"],
    imageUrl: "/placeholder.svg",
    galleryImages: ["/placeholder.svg"],
    githubUrl: "https://github.com",
  },
  {
    id: "5",
    title: "Portfolio Generator",
    shortDescription: "CLI tool to scaffold developer portfolios.",
    fullDescription:
      "A command-line tool that generates static portfolio websites from a JSON config file. Supports multiple themes and deployment to GitHub Pages.",
    details: "",
    notes: "",
    techStack: ["Node.js", "Handlebars", "CLI"],
    imageUrl: "/placeholder.svg",
    galleryImages: ["/placeholder.svg"],
    githubUrl: "https://github.com",
  },
];
