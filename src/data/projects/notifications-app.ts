import { Project } from "@/types/portfolio";

const notificationsApp: Project = {
    id: "notifications-app",
    title: "Notifications App",
    shortDescription:
        "A compact React app for triaging notifications: dismiss one, clear all, and watch the count update.",
    thumbnailImageUrl: "/notification/notifications.webp",
    imageUrl: "/notification/notifications.webp",
    year: "2025",
    category: "Study",
    sector: "React coursework",
    client: "College coursework",
    platform: "React + Vite",
    role: "Front-end development",
    goal: "Build a small interface that makes notification triage obvious: see what's waiting, remove what's done, clear the rest.",
    brief:
        "A small React exercise in state and list rendering: dismiss, clear and keep a live count, with no backend.",
    challenge:
        "The brief asked for real state changes and a live count in a tiny surface area, with no backend to lean on.",
    approach: [
        "Component structure around a single notifications list",
        "Live unread count driven by React state",
        "Single-item dismiss and clear-all actions",
    ],
    outcome:
        "A clean, responsive micro-app that demonstrates state, list rendering and interaction without extra dependencies.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "Interactive", label: "user-driven updates" },
        { value: "1", label: "source of truth for state" },
        { value: "A+", label: "for logic structure" },
    ],
    gallery: [
        {
            src: "/notification/overview.webp",
            alt: "Notifications list with a live unread count",
        },
        {
            src: "/notification/solution.webp",
            alt: "Dismiss and clear-all actions in the interface",
        },
    ],
    techStack: ["React", "Vite", "JavaScript", "CSS"],
    liveUrl: "https://camperkunz.github.io/Notifications-App/",
    githubUrl: "https://github.com/Camperkunz/Notifications-App",
};

export default notificationsApp;
