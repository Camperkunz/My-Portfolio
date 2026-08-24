import { Project } from "@/types/portfolio";

const contactBook: Project = {
    id: "contact-book",
    title: "Contact Book App",
    shortDescription: "A single-page contact management application built with Vue, allowing users to add, edit, search, and manage contacts stored in local storage.",
    fullDescription:
        "This project is a single-page contact management application developed as part of a coursework assignment. The goal was to build a functional web app using Vue, Vue Router, and Vite while implementing persistent data storage through the browser’s local storage. The application allows users to browse a list of contacts, search by name, and manage contact information through a simple interface.Users can create new contacts, view detailed information, edit existing entries, and delete contacts when needed.",
    thumbnailImageUrl: "/contact-book/contact-book.jpg", // ← this is the small thumbnail image for the project, used in the projects section
    imageUrl: "/contact-book/contact-book.jpg",// ← this is the main image for the project, hero image on the project page
    overviewImageUrl: "", // ← inside the component, first
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
    problemImageUrl: "/contact-book/problem.jpg", // ← replace
    solution: "I built the application using Vue 3 and Vue Router, structuring the project into multiple views and reusable components. Local storage was used to store and persist contact data, while forms and interactive elements were implemented to allow users to add, edit, search, and delete contacts easily.",
    solutionImageUrl: "/contact-book/solution.jpg", // ← replace
    results: "The result is a simple and intuitive contact management application that demonstrates core frontend concepts such as client-side routing, state management, and data persistence. The project strengthened my understanding of building structured SPAs using Vue.",
    resultsImageUrl: "/contact-book/results.jpg", // ← replace
    techStack: ["Vue", "Vite", "JavaScript", "CSS"],
    liveUrl: "https://niki0012a.github.io/Vue-Contact-Book/",
    githubUrl: "https://github.com/niki0012A/Vue-Contact-Book",
};

export default contactBook;
