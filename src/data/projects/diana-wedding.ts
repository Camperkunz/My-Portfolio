import { Project } from "@/types/portfolio";

const dianaWedding: Project = {
    id: "diana-wedding",
    title: "Wedding Planner Website",
    shortDescription: "A Full-Stack Next.js platform for an Ottawa wedding planner, with Sanity CMS for services, real weddings, and FAQs — built for seamless client onboarding without code.",
    fullDescription:
        "Diana is an Ottawa-based wedding planner and coordinator covering full planning, micro-weddings, and day-of management for celebrations. She needed a web presence that reflects the calm, deliberate tone of her work, lets couples transparently compare her service packages, and showcases past weddings. I designed and built a full-stack web application using Next.js, TypeScript, and Sanity CMS. All services, client stories, testimonials, and FAQs live in structured Sanity models, allowing real-time content management without developer intervention. The site combines server-side rendering, automated image optimization via Sanity CDN, and transactional inquiry routing via Resend.",
    thumbnailImageUrl: "/diana-wedding/main.webp",
    imageUrl: "/diana-wedding/main.webp",
    overviewImageUrl: "/diana-wedding/main.webp",
    year: "2026",
    category: "Freelance • Full-Stack & Design",
    highlights: [
        "Headless Sanity CMS architecture for code-free management of services, portfolios, and FAQs",
        "High-intent inquiry form integrated with Resend API for instant transactional notifications",
        "Image pipeline utilizing Sanity CDN and Next.js image optimization for fast mobile loading",
        "Server-rendered pages with custom metadata and Open Graph tags for local search discovery",
        "Edge deployment on Cloudflare with automated HTTPS, caching, and custom domain setup",
    ],
    problem: "Wedding planning is built on trust, yet critical details couples need before reaching out are often scattered across social media feeds. High-value service inclusions are hard to compare, while incoming inquiries regularly lack event dates, guest counts, and venue locations — the exact data points required to qualify leads and provide meaningful initial estimates.",
    problemImageUrl: "/diana-wedding/services.webp",
    solution: "I created an end-to-end digital experience designed around the client decision journey. The homepage establishes clarity upfront through a side-by-side service breakdown, a structured five-step planning workflow, verified client reviews, and an interactive real-wedding portfolio. Each featured wedding includes a curated image gallery and case story. By backing every section with structured Sanity schemas, the site scales effortlessly with Diana's portfolio without requiring code deployments.",
    solutionImageUrl: "/diana-wedding/portfolio.webp",
    implementation: "The site is engineered as a Next.js application written in type-safe TypeScript, utilizing Sanity as a headless content infrastructure. To deliver peak performance for image-heavy wedding galleries, visual assets are served through Sanity CDN with adaptive compression and responsive sizing. The guided contact form captures high-intent project parameters — event date, guest count, venue, and desired package — before dispatching structured emails via the Resend API. The entire application is deployed on Cloudflare’s global edge network, delivering instant initial page loads on mobile devices where most target clients discover her work.",
    implementationImageUrl: "/diana-wedding/contact.webp",
    results: "Diana gained a centralized, highly polished platform that sets clear expectations and streamlines client onboarding. Inquiries now arrive pre-qualified with complete event context, allowing for personalized initial responses. Content management is completely detached from source code, enabling instant portfolio updates, while the performant edge deployment delivers a fast, low-friction experience across all desktop and mobile viewports.",
    resultsImageUrl: "/diana-wedding/cta.webp",
    techStack: ["Next.js", "TypeScript", "Sanity", "Tailwind CSS", "Cloudflare"],
    liveUrl: "https://dianavoloshina.com",
    githubUrl: "https://github.com/Camperkunz/Diana-Wedding-Planner",
    featured: true,
};

export default dianaWedding;