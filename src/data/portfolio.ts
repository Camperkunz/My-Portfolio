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
    title: "Portfolio Website",
    shortDescription: "A modern, responsive portfolio website showcasing my skills and projects.",
    fullDescription:
      "A sleek, responsive portfolio website built with React and TypeScript, featuring a clean design and smooth animations. Showcases my work, experience, and skills in a visually appealing manner.",
    year: "2026",
    category: "Personal Project",
    highlights: [
      "Drag-and-drop kanban boards with smooth animations",
      "Real-time collaboration using WebSockets",
      "JWT-based authentication with role management",
    ],
    problem: "Teams needed a lightweight, intuitive tool for managing tasks without the complexity of enterprise solutions.",
    problemImageUrl: "/portfolio.jpg", // ← replace with your own screenshot
    solution: "Built a streamlined kanban board with real-time sync, focusing on speed and simplicity over feature bloat.",
    solutionImageUrl: "/portfolio.jpg", // ← replace with your own screenshot
    results: "Achieved sub-100ms interaction latency and a fully responsive interface that works seamlessly across devices.",
    resultsImageUrl: "/portfolio.jpg", // ← replace with your own screenshot
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
    imageUrl: "/portfolio.jpg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "2",
    title: "Shopify E-Commerce Store",
    shortDescription: "A fully functional e-commerce store ",
    fullDescription:
      "A complete Shopify e-commerce website featuring a modern design, seamless user experience, and robust functionality for managing products, orders, and inventory.",
    year: "2025",
    category: "Frontend Development",
    highlights: [
      "Interactive charts with Recharts for data visualization",
      "Geolocation-based automatic weather detection",
      "7-day forecast with hourly breakdowns",
      "Historical trend comparison views",
    ],
    problem: "Existing weather apps lacked clean data visualization and the ability to compare historical weather patterns.",
    problemImageUrl: "/unique-website.jpg", // ← replace
    solution: "Created a dashboard-first approach with interactive charts that make weather data intuitive and visually engaging.",
    solutionImageUrl: "/unique-website.jpg", // ← replace
    techStack: ["Shopify", "Figma", "HTML", "CSS"],
    imageUrl: "/unique-website.jpg",
    liveUrl: "https://uniquefabricpanels.com/",
  },
  {
    id: "3",
    title: "Loop Studios",
    shortDescription: "Frontend Mentor Challenge",
    fullDescription:
      "A minimal e-commerce storefront featuring product listings, filtering, cart management, and a mock checkout flow. Fully responsive with optimistic UI updates.",
    year: "2025",
    category: "Frontend Development",
    highlights: [
      "Optimistic UI updates for cart interactions",
      "Advanced product filtering and search",
      "Stripe integration for payment processing",
      "Fully responsive mobile-first design",
    ],
    problem: "Small businesses needed a simple, fast storefront without the overhead of complex e-commerce platforms.",
    problemImageUrl: "/loopstudios.jpg", // ← replace
    solution: "Built a lightweight storefront with a focus on speed, clean UX, and essential e-commerce features only.",
    solutionImageUrl: "/loopstudios.jpg", // ← replace
    techStack: ["JavaScript", "HTML", "CSS"],
    imageUrl: "/loopstudios.jpg",
    githubUrl: "https://github.com/Camperkunz/Loopstudios",
    liveUrl: "https://camperkunz.github.io/Loopstudios/",
  },
  {
    id: "4",
    title: "Advocacy Website for CAOT",
    shortDescription: "Minimal storefront with cart management, product filtering, and a streamlined checkout flow.",
    fullDescription:
      "A minimal e-commerce storefront featuring product listings, filtering, cart management, and a mock checkout flow. Fully responsive with optimistic UI updates.",
    year: "2025",
    category: "Web Design & Development",
    highlights: [
      "Optimistic UI updates for cart interactions",
      "Advanced product filtering and search",
      "Stripe integration for payment processing",
      "Fully responsive mobile-first design",
    ],
    problem: "Small businesses needed a simple, fast storefront without the overhead of complex e-commerce platforms.",
    problemImageUrl: "/advocacy.jpg", // ← replace
    solution: "Built a lightweight storefront with a focus on speed, clean UX, and essential e-commerce features only.",
    solutionImageUrl: "/advocacy.jpg", // ← replace
    techStack: ["Squarespace", "Figma", "JavaScript", "HTML", "CSS"],
    imageUrl: "/advocacy.jpg",
    liveUrl: "https://www.figma.com/proto/lnRSLrif5eREP6cWtG3tlB/Advocacy?page-id=0%3A1&node-id=0-188&viewport=474%2C376%2C0.11&t=ZRQUcjHabGhCNG7c-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=0%3A188",
  },
  {
    id: "5",
    title: "Notification App",
    shortDescription: "CLI tool to scaffold developer portfolios from a JSON config with multiple themes.",
    fullDescription:
      "A command-line tool that generates static portfolio websites from a JSON config file. Supports multiple themes and deployment to GitHub Pages.",
    year: "2025",
    category: "Personal Project",
    highlights: [
      "JSON-based configuration for easy customization",
      "Multiple built-in themes",
      "One-command deployment to GitHub Pages",
      "Handlebars templating for flexible layouts",
    ],
    problem: "Developers wanted a quick way to generate portfolio sites without manually coding each one from scratch.",
    problemImageUrl: "/notifications.jpg", // ← replace
    solution: "Built a CLI that reads a simple JSON file and generates a fully styled, deployable portfolio in seconds.",
    solutionImageUrl: "/notifications.jpg", // ← replace
    techStack: ["React", "Vite", "Firebase", "JavaScript", "CSS"],
    imageUrl: "/notifications.jpg",
    liveUrl: "https://camperkunz.github.io/Notifications-App/",
    githubUrl: "https://github.com/Camperkunz/Notifications-App",
  },
];
