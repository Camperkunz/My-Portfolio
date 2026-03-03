import { Experience, Education, Project } from "@/types/portfolio";

export const personalInfo = {
  name: "Anna Nikiforova",
  title: "Frontend Developer",
  tagline: "Frontend Developer. Building clean, performant interfaces with modern web technologies.",
  github: "https://github.com/Camperkunz",
  linkedin: "https://www.linkedin.com/in/anna-nikiforova-ac/",
  email: "anyanikiforova04@gmail.com",
  phone: "+1 (343) 297-6170",
  address: "Ottawa, ON, Canada",
  logo: '/favicon.png',
  image: "/anna-photo.jpg",
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
    company: "The Canadian Association of Occupational Therapists",
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
      "Graduated with honour (GPA: 4.0 / 4.0)"
    ]
  },
  {
    institution: "A. G. Pozdeev Art School",
    degree: "Fine/Studio Arts, General",
    period: "Feb 2019 — May 2022",
    description: [],
    
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Task Manager",
    shortDescription: "A kanban-style task management app with drag-and-drop functionality, real-time collaboration, and dark mode support.",
    fullDescription:
      "Full-featured task management application with drag-and-drop kanban boards, user authentication, real-time collaboration, and dark mode support. Built with React and a Node.js backend.",
    year: "2025",
    category: "Web App",
    highlights: [
      "Drag-and-drop kanban boards with smooth animations",
      "Real-time collaboration using WebSockets",
      "JWT-based authentication with role management",
      "Dark mode with system preference detection",
      "Optimistic UI updates for instant feedback",
    ],
    problem: "Teams needed a lightweight, intuitive tool for managing tasks without the complexity of enterprise solutions.",
    solution: "Built a streamlined kanban board with real-time sync, focusing on speed and simplicity over feature bloat.",
    implementation: "Used React with TypeScript for the frontend, Node.js with Express for the API, and WebSockets for real-time updates. Tailwind CSS handled the responsive design system.",
    results: "Achieved sub-100ms interaction latency and a fully responsive interface that works seamlessly across devices.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "2",
    title: "Weather Dashboard",
    shortDescription: "Real-time weather data visualization with interactive charts, geolocation support, and historical trend analysis.",
    fullDescription:
      "Weather dashboard that displays real-time forecasts, historical trends, and interactive charts. Integrates with OpenWeatherMap API and supports geolocation.",
    year: "2025",
    category: "Frontend",
    highlights: [
      "Interactive charts with Recharts for data visualization",
      "Geolocation-based automatic weather detection",
      "7-day forecast with hourly breakdowns",
      "Historical trend comparison views",
    ],
    problem: "Existing weather apps lacked clean data visualization and the ability to compare historical weather patterns.",
    solution: "Created a dashboard-first approach with interactive charts that make weather data intuitive and visually engaging.",
    techStack: ["React", "Recharts", "OpenWeatherMap API"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "E-Commerce Store",
    shortDescription: "Minimal storefront with cart management, product filtering, and a streamlined checkout flow.",
    fullDescription:
      "A minimal e-commerce storefront featuring product listings, filtering, cart management, and a mock checkout flow. Fully responsive with optimistic UI updates.",
    year: "2024",
    category: "Web App",
    highlights: [
      "Optimistic UI updates for cart interactions",
      "Advanced product filtering and search",
      "Stripe integration for payment processing",
      "Fully responsive mobile-first design",
    ],
    problem: "Small businesses needed a simple, fast storefront without the overhead of complex e-commerce platforms.",
    solution: "Built a lightweight storefront with a focus on speed, clean UX, and essential e-commerce features only.",
    techStack: ["Next.js", "Stripe", "Tailwind CSS"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "4",
    title: "Markdown Editor",
    shortDescription: "Live preview markdown editor with syntax highlighting, custom themes, and PDF export.",
    fullDescription:
      "A split-pane markdown editor with real-time preview, syntax highlighting, and export to PDF. Supports custom themes and keyboard shortcuts.",
    year: "2024",
    category: "Developer Tool",
    highlights: [
      "Split-pane editing with real-time preview",
      "Syntax highlighting with CodeMirror",
      "PDF export with custom styling",
      "Keyboard shortcuts for power users",
    ],
    problem: "Developers needed a fast, distraction-free markdown editor that works in the browser with instant preview.",
    solution: "Created a focused editor with a split-pane layout, keeping the writing experience clean while providing instant visual feedback.",
    techStack: ["React", "CodeMirror", "Marked"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
  },
  {
    id: "5",
    title: "Portfolio Generator",
    shortDescription: "CLI tool to scaffold developer portfolios from a JSON config with multiple themes.",
    fullDescription:
      "A command-line tool that generates static portfolio websites from a JSON config file. Supports multiple themes and deployment to GitHub Pages.",
    year: "2024",
    category: "CLI Tool",
    highlights: [
      "JSON-based configuration for easy customization",
      "Multiple built-in themes",
      "One-command deployment to GitHub Pages",
      "Handlebars templating for flexible layouts",
    ],
    problem: "Developers wanted a quick way to generate portfolio sites without manually coding each one from scratch.",
    solution: "Built a CLI that reads a simple JSON file and generates a fully styled, deployable portfolio in seconds.",
    techStack: ["Node.js", "Handlebars", "CLI"],
    imageUrl: "/placeholder.svg",
    githubUrl: "https://github.com",
  },
];
