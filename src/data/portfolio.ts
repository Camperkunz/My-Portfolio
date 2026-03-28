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
  logo: '/favicon.webp',
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
    id: "portfolio",
    title: "Portfolio Website",
    shortDescription: "A personal portfolio website built with React and Tailwind CSS to showcase my projects, skills, and approach to frontend development.",
    fullDescription:
      "This portfolio website is my first full project after graduation and represents a combination of manual development and AI-assisted workflows. The goal was to create a clean, modern space where I could present my work and demonstrate my frontend development skills. The project allowed me to experiment with React, components, layouts, and animation while translating my own ideas into a working product.",
    overviewImageUrl: "/portfolio/portfolio-overview.jpg", // ← replace with your own screenshot
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
    problemImageUrl: "/portfolio/portfolio-problem.jpg", // ← replace with your own screenshot
    solution: "I designed and developed a custom portfolio website from scratch using React and Tailwind CSS. The focus was on simplicity, readability, and a clean visual structure that highlights projects while keeping navigation intuitive.",
    solutionImageUrl: "/portfolio/portfolio-solution.jpg", // ← replace with your own screenshot
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
    imageUrl: "/portfolio/portfolio.jpg",
    githubUrl: "https://github.com/Camperkunz/My-Portfolio",
    liveUrl: "/",
  },
  // 
  {
    id: "unique-ecommerce",
    title: "Shopify E-Commerce Store",
    shortDescription: "A custom Shopify store designed for a small fabric business to relaunch their online presence and convert social media traffic into sales.",
    fullDescription:
      "This project focused on rebuilding the online presence of a small fabric business whose previous website was outdated and difficult to use. The goal was to migrate the brand from primarily selling through social media to a fully functional online store. I designed the entire website and built the store on Shopify, focusing on clear product presentation, intuitive navigation, and strong SEO foundations.",
    overviewImageUrl: "", // ← replace with your own screenshot
    year: "2025",
    category: "Frontend Development",
    highlights: [
      "Designed the complete UI and structure of the e-commerce store",
      "Built and customized a Shopify theme using Liquid",
      "Created custom sections and code blocks for additional flexibility",
      "Implemented SEO best practices for improved search visibility",

    ],
    problem: "The business relied mostly on social media to sell products, while their existing website was outdated, slow, and difficult to navigate. It failed to properly showcase the products and did not support a smooth online shopping experience.",
    problemImageUrl: "/unique/unique-problem.jpg", // ← replace
    solution: "I redesigned the entire website and migrated the store to Shopify, creating a clean and intuitive shopping experience. The project included designing the layout, improving the content structure, organizing collections, and implementing SEO strategies. Custom Liquid code and theme modifications were used to adapt the Shopify theme to the specific needs of the business and allow more flexibility in presenting products.",
    solutionImageUrl: "/unique/unique-solution.jpg", // ← replace
    results: "The new website provides the business with a modern, professional online store that properly showcases their products and supports online sales. The improved structure, SEO optimization, and clear product organization make it easier for customers to discover fabrics and complete purchases, while giving the business a scalable platform for future growth.",
    resultsImageUrl: "/unique/unique-results.jpg", // ← replace
    techStack: ["Shopify", "Figma", "HTML", "CSS"],
    imageUrl: "/unique/unique-website.jpg",
    liveUrl: "https://uniquefabricpanels.com/",
  },
  // 
  {
    id: "loopstudios",
    title: "Loopstudios Landing Page",
    shortDescription: "A fully responsive landing page for a VR company built as part of a Frontend Mentor challenge, focusing on clean code.",
    fullDescription:
      "This project is a responsive landing page built as part of a Frontend Mentor challenge. The goal was to recreate a provided design as accurately as possible while maintaining clean, semantic code and responsive behavior across different screen sizes. All HTML, CSS, and JavaScript were written from scratch based on the design reference.The project focused on translating a static design into a functional webpage.",
    overviewImageUrl: "", // ← replace with your own screenshot
    year: "2025",
    category: "Frontend Development",
    highlights: [
      "Pixel-accurate recreation of the original design",
      "Fully responsive layout for mobile and desktop",
      "Interactive UI elements built with vanilla JavaScript",
      "Clean, semantic HTML structure and well-organized CSS"
    ],
    problem: "The challenge was to accurately translate a static design into a responsive webpage while keeping the code clean, semantic, and maintainable.",
    problemImageUrl: "/loop-studios/loop-problem.jpg", // ← replace
    solution: "I built the page using HTML, CSS, and vanilla JavaScript, implementing the layout with Flexbox and Grid and carefully matching the provided design. Responsive breakpoints were added to ensure the layout works smoothly across mobile and desktop devices.",
    solutionImageUrl: "/loop-studios/loop-solution.jpg", // ← replace
    results: "The final result closely matches the original design while maintaining clean, structured code and responsive behavior. The project helped strengthen my skills in layout implementation, responsive design, and writing organized frontend code.",
    resultsImageUrl: "/loop-studios/loop-result.jpg", // ← replace
    techStack: ["JavaScript", "HTML", "CSS"],
    imageUrl: "/loop-studios/loopstudios.jpg",
    githubUrl: "https://github.com/niki0012A/Loopstudios-Website",
    liveUrl: "https://camperkunz.github.io/Loopstudios/",
  },
  // 
  {
    id: "contact-book",
    title: "Contact Book App",
    shortDescription: "A single-page contact management application built with Vue, allowing users to add, edit, search, and manage contacts stored in local storage.",
    fullDescription:
      "This project is a single-page contact management application developed as part of a coursework assignment. The goal was to build a functional web app using Vue, Vue Router, and Vite while implementing persistent data storage through the browser’s local storage. The application allows users to browse a list of contacts, search by name, and manage contact information through a simple interface.Users can create new contacts, view detailed information, edit existing entries, and delete contacts when needed.",
    overviewImageUrl: "", // ← replace with your own screenshot
    year: "2025",
    category: "Personal Project",
    highlights: [
      "Built a single-page application using Vue 3 and Vue Router",
      "Implemented contact search and alphabetical sorting",
      "Added functionality to remove individual contacts",
      "Implemented delete functionality with automatic UI updates",
      "Stored and persisted data using browser local storage",
    ],
    problem: "The assignment required creating a fully functional contact management application that demonstrates SPA architecture, client-side routing, and persistent data storage.",
    problemImageUrl: "/contact-book/contact-problem.jpg", // ← replace
    solution: "I built the application using Vue 3 and Vue Router, structuring the project into multiple views and reusable components. Local storage was used to store and persist contact data, while forms and interactive elements were implemented to allow users to add, edit, search, and delete contacts easily.",
    solutionImageUrl: "/contact-book/contact-solution.jpg", // ← replace
    results: "The result is a simple and intuitive contact management application that demonstrates core frontend concepts such as client-side routing, state management, and data persistence. The project strengthened my understanding of building structured SPAs using Vue.",
    resultsImageUrl: "/contact-book/contact-result.jpg", // ← replace
    techStack: ["Vue", "Vite", "JavaScript", "CSS"],
    imageUrl: "/contact-book/contact-book.jpg",
    liveUrl: "https://niki0012a.github.io/Vue-Contact-Book/",
    githubUrl: "https://github.com/niki0012A/Vue-Contact-Book",
  },
  // 
  {
    id: "advocacy-caot",
    title: "Advocacy Website for CAOT",
    shortDescription: "A website redesign and prototype for an advocacy initiative by CAOT, focusing on modernizing the brand and improving the structure and clarity of the content.",
    fullDescription:
      "This project involved designing and prototyping a new advocacy website for CAOT. Since the project had not yet been launched publicly, the main focus was on research, prototyping, and developing a strong visual direction for the platform. I worked primarily on the design side, rethinking the existing brand presentation and creating a clearer, more modern visual identity. After the design phase, I began implementing the website in Squarespace, using custom code and platform customization to match the design as closely as possible.",
    overviewImageUrl: "", // ← replace with your own screenshot
    year: "2025",
    category: "Web Design & Development",
    highlights: [
      "Designed the overall UI and layout for an advocacy-focused website",
      "Developed interactive prototypes to test structure and user flow",
      "Refined and modernized elements of the existing brand presentation",
      "Implemented the design in Squarespace with custom code and styling",
    ],
    problem: "The organization needed a dedicated advocacy website that would clearly communicate its mission, present information in a structured way, and align better with modern web design standards.",
    problemImageUrl: "/advocacy/advocacy-problem.jpg", // ← replace
    solution: "I designed a new visual direction for the website and created prototypes to establish clear page layouts and user flows. After finalizing the design approach, I began implementing the website in Squarespace, using custom code and platform customization to translate the design into a functional site.",
    solutionImageUrl: "/advocacy/advocacy-solution.jpg", // ← replace
    results: "The project produced a complete design and working site structure ready for launch, giving the organization a clearer and more modern platform for communicating its advocacy initiatives once published.",
    resultsImageUrl: "/advocacy/advocacy-results.jpg", // ← replace
    techStack: ["Squarespace", "Figma", "JavaScript", "HTML", "CSS"],
    imageUrl: "/advocacy/advocacy.jpg",
    liveUrl: "https://www.figma.com/proto/lnRSLrif5eREP6cWtG3tlB/Advocacy?page-id=0%3A1&node-id=0-188&viewport=474%2C376%2C0.11&t=ZRQUcjHabGhCNG7c-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=0%3A188",
  },
  // 
  {
    id: "notifications-app",
    title: "Notifications App",
    shortDescription: "A small React application for managing notifications, built as a college project to demonstrate frontend development and UI design skills.",
    fullDescription:
      "This project is a micro web application built with React and Vite as part of a college assignment. The goal was to design and develop a clean, functional interface for managing notifications while practicing component-based architecture and state management in React. The application displays a list of notifications and allows users to interact with them by deleting individual items or clearing the entire list.",
    overviewImageUrl: "/notification/notification-overview.jpg", // ← replace with your own screenshot
    year: "2025",
    category: "Personal Project",
    highlights: [
      "Built a notification management interface using React",
      "Implemented dynamic notification count with React state",
      "Added functionality to remove individual notifications",
      "Implemented “clear all” functionality for quick actions",
      "Created a responsive layout for different screen sizes",
    ],
    problem: "The assignment required building a small interactive application that demonstrates frontend development fundamentals such as component structure, state management, and user interaction.",
    problemImageUrl: "/notification/notification-problem.jpg", // ← replace
    solution: "I developed a React-based application that displays notifications in a structured interface and allows users to manage them through simple actions like deleting individual notifications or clearing the entire list. The project was built using Vite for fast development and organized into reusable components.",
    solutionImageUrl: "/notification/notification-solution.jpg", // ← replace
    results: "The result is a clean, interactive micro application that demonstrates core React concepts and UI design skills. You can explore the live version of the project and interact with the notifications yourself.",
    resultsImageUrl: "/notification/notification-result.jpg", // ← replace
    techStack: ["React", "Vite", "JavaScript", "CSS"],
    imageUrl: "/notification/notifications.jpg",
    liveUrl: "https://camperkunz.github.io/Notifications-App/",
    githubUrl: "https://github.com/Camperkunz/Notifications-App",
  },
];
