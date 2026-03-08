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
    shortDescription: "A personal portfolio website built with React and Tailwind CSS to showcase my projects, skills, and approach to frontend development.",
    fullDescription:
      "This portfolio website is my first full project after graduation and represents a combination of manual development and AI-assisted workflows. The goal was to create a clean, modern space where I could present my work and demonstrate my frontend development skills. The project allowed me to experiment with React, components, layouts, and animation while translating my own ideas into a working product.",
    year: "2026",
    category: "Personal Project",
    highlights: [
      "Designed and developed a custom portfolio from scratch",
      "Built with React, TypeScript, and Tailwind CSS",
      "Fully responsive layout optimized for desktop, tablet, and mobile",
      "Reusable component-based architecture",
      "Smooth UI interactions and modern visual design",
      "AI-assisted workflow combined with manual development",
    ],
    problem: "As a junior frontend developer, I needed a professional way to present my projects, skills, and development approach to potential employers. Existing portfolio templates felt generic and did not reflect my personal style or the combination of creativity and coding that defines my work",
    problemImageUrl: "/portfolio.jpg", // ← replace with your own screenshot
    solution: "I designed and developed a custom portfolio website from scratch using React and Tailwind CSS. The focus was on simplicity, readability, and a clean visual structure that highlights projects while keeping navigation intuitive.",
    solutionImageUrl: "/portfolio.jpg", // ← replace with your own screenshot
    results: "The result is a fast, responsive portfolio website that clearly showcases my projects, skills, and development style. It also became a valuable learning experience that strengthened my React workflow, UI design decisions, and overall frontend architecture skills. And of course - you’re already here, so feel free to explore the site and see the results for yourself!",
    resultsImageUrl: "/portfolio.jpg", // ← replace with your own screenshot
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
    imageUrl: "/portfolio.jpg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  // 
  {
    id: "2",
    title: "Shopify E-Commerce Store",
    shortDescription: "A custom Shopify store designed for a small fabric business to relaunch their online presence and convert social media traffic into sales.",
    fullDescription:
      "This project focused on rebuilding the online presence of a small fabric business whose previous website was outdated and difficult to use. The goal was to migrate the brand from primarily selling through social media to a fully functional online store. I designed the entire website and built the store on Shopify, focusing on clear product presentation, intuitive navigation, and strong SEO foundations.",
    year: "2025",
    category: "Frontend Development",
    highlights: [
      "Designed the complete UI and structure of the e-commerce store",
      "Built and customized a Shopify theme using Liquid",
      "Created custom sections and code blocks for additional flexibility",
      "Implemented SEO best practices for improved search visibility",

    ],
    problem: "The business relied mostly on social media to sell products, while their existing website was outdated, slow, and difficult to navigate. It failed to properly showcase the products and did not support a smooth online shopping experience.",
    problemImageUrl: "/unique-website.jpg", // ← replace
    solution: "I redesigned the entire website and migrated the store to Shopify, creating a clean and intuitive shopping experience. The project included designing the layout, improving the content structure, organizing collections, and implementing SEO strategies. Custom Liquid code and theme modifications were used to adapt the Shopify theme to the specific needs of the business and allow more flexibility in presenting products.",
    solutionImageUrl: "/unique-website.jpg", // ← replace
    results: "The new website provides the business with a modern, professional online store that properly showcases their products and supports online sales. The improved structure, SEO optimization, and clear product organization make it easier for customers to discover fabrics and complete purchases, while giving the business a scalable platform for future growth.",
    resultsImageUrl: "/unique-website.jpg", // ← replace
    techStack: ["Shopify", "Figma", "HTML", "CSS"],
    imageUrl: "/unique-website.jpg",
    liveUrl: "https://uniquefabricpanels.com/",
  },
  // 
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
  // 
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
  // 
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
