import { Project } from "@/types/portfolio";

const notificationsApp: Project = {
    id: "notifications-app",
    title: "Notifications App",
    shortDescription: "A small React application for managing notifications, built as a college project to demonstrate frontend development and UI design skills.",
    fullDescription:
        "This project is a micro web application built with React and Vite as part of a college assignment. The goal was to design and develop a clean, functional interface for managing notifications while practicing component-based architecture and state management in React. The application displays a list of notifications and allows users to interact with them by deleting individual items or clearing the entire list.",
    thumbnailImageUrl: "/notification/notifications.jpg", // ← this is the small thumbnail image for the project, used in the projects section
    imageUrl: "/notification/notifications.jpg", // ← this is the main image for the project, hero image on the project page
    overviewImageUrl: "/notification/overview.jpg", // ← inside the component, first
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
    problemImageUrl: "/notification/problem.jpg", // ← replace
    solution: "I developed a React-based application that displays notifications in a structured interface and allows users to manage them through simple actions like deleting individual notifications or clearing the entire list. The project was built using Vite for fast development and organized into reusable components.",
    solutionImageUrl: "/notification/solution.jpg", // ← replace
    results: "The result is a clean, interactive micro application that demonstrates core React concepts and UI design skills. You can explore the live version of the project and interact with the notifications yourself.",
    resultsImageUrl: "/notification/results.jpg", // ← replace
    techStack: ["React", "Vite", "JavaScript", "CSS"],
    liveUrl: "https://camperkunz.github.io/Notifications-App/",
    githubUrl: "https://github.com/Camperkunz/Notifications-App",
};

export default notificationsApp;
