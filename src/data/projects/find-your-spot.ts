import { Project } from "@/types/portfolio";

const findYourSpot: Project = {
    id: "find-your-spot",
    title: "Find Your Spot",
    shortDescription: "A location-aware discovery app that turns \"what should we do?\" into a few quick choices and a curated deck of nearby spots to explore in Ottawa.",
    fullDescription:
        "Find Your Spot is a location-aware discovery app that helps users quickly find interesting places to go based on their current mood. Instead of scrolling through long lists, users pick how much time they have, what kind of vibe they're after, and who's coming along, then browse a curated deck of nearby spots and save the ones they like. The app is currently live for Ottawa, ON, with more Canadian cities planned for the future.",
    thumbnailImageUrl: "/find-your-spot/thumbnail.png", // ← this is the small thumbnail image for the project, used in the projects section
    imageUrl: "", // ← this is the main image for the project, hero image on the project page
    overviewImageUrl: "/find-your-spot/overview.png", // ← inside the component, first
    year: "2026",
    category: "Personal Project",
    highlights: [
        "Quick mood-based filtering by duration, vibe, and companions",
        "Save and manage a shortlist of favorite spots",
        "One-tap directions integration for navigation",
        "Mobile-first responsive design that scales up to desktop",
        "Global app state managed through React Context API",
    ],
    problem: "Deciding what to do or where to go nearby often means scrolling through long, unfiltered lists that don't account for how much time someone has, the mood they're in, or who they're with. There was no quick, mood-based way to discover nearby spots in Ottawa.",
    problemImageUrl: "/find-your-spot/problem.png", // ← replace
    solution: "I built a React and Vite web app that narrows down destinations through a short onboarding flow — duration, vibe, and companions — and generates a swipeable deck of matching local spots. Users can save spots to a shortlist, get directions with one tap, and manage their saved list, all backed by a JSON dataset of curated Ottawa destinations and global state handled through React Context.",
    solutionImageUrl: "/find-your-spot/solution.png", // ← replace
    results: "The result is a fast, focused discovery experience that replaces open-ended searching with a few quick taps and a curated deck of relevant spots. The app is live for Ottawa, with the architecture designed to expand to additional Canadian cities in the future.",
    resultsImageUrl: "/find-your-spot/results.png", // ← replace
    techStack: ["React", "JavaScript", "Tailwind CSS", "Vite"],
    githubUrl: "https://github.com/Camperkunz/Find-Your-Spot",
    liveUrl: "https://find-your-spot-ca.vercel.app/",
    // 
    featured: true,
};

export default findYourSpot;