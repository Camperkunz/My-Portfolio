import { Project } from "@/types/portfolio";

const contactBook: Project = {
    id: "contact-book",
    title: "Contact Book",
    shortDescription:
        "A Vue single-page contact manager with search, sorting and edits that persist in local storage.",
    thumbnailImageUrl: "/contact-book/contact-book.webp",
    imageUrl: "/contact-book/contact-book.webp",
    year: "2025",
    category: "Study",
    sector: "Vue coursework",
    client: "College coursework",
    platform: "Vue 3 + Vite",
    role: "Front-end development",
    goal: "Practise a real SPA architecture — routing, components and state — in an app that stays simple to use.",
    brief:
        "A Vue 3 coursework build covering the full CRUD loop with routing, components and persistence across reloads.",
    challenge:
        "The assignment required full create, read, edit and delete flows with data that survives a page reload, without a backend.",
    approach: [
        "Vue 3 SPA with Vue Router views",
        "Search, alphabetical sorting and inline deletion",
        "Local storage as the persistence layer",
    ],
    outcome:
        "A working contact manager that covers the full CRUD loop and keeps every change after refresh.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "A+", label: "for code quality" },
        { value: "SPA", label: "local and fast" },
        { value: "100%", label: "data persisted locally" },
    ],
    gallery: [
        {
            src: "/contact-book/problem.webp",
            alt: "Contact list with search and sorting",
        },
        {
            src: "/contact-book/solution.webp",
            alt: "Contact detail and edit view",
        },
    ],
    techStack: ["Vue", "Vite", "JavaScript", "CSS"],
    liveUrl: "https://niki0012a.github.io/Vue-Contact-Book/",
    githubUrl: "https://github.com/niki0012A/Vue-Contact-Book",
};

export default contactBook;
