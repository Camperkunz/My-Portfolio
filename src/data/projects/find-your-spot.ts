import { Project } from "@/types/portfolio";

const findYourSpot: Project = {
    id: "find-your-spot",
    title: "Find Your Spot — Travel App",
    shortDescription:
        "A mood-first discovery app that turns “what should we do?” into three quick choices and a curated deck of Ottawa spots.",
    thumbnailImageUrl: "/find-your-spot/thumbnail.webp",
    imageUrl: "/find-your-spot/overview.webp",
    year: "2026",
    category: "Personal",
    sector: "Local discovery",
    client: "Personal project",
    location: "Ottawa, Canada",
    platform: "React + Vite",
    role: "Design & front-end",
    goal: "Replace endless list-scrolling with three quick choices — time, vibe and company — and a shortlist you can act on right away.",
    brief:
        "A React discovery app for Ottawa that turns “where should we go?” into a shortlist based on time, vibe and company.",
    challenge:
        "Deciding where to go meant scrolling through long, unfiltered lists that ignored how much time, energy or company you had.",
    approach: [
        "Onboarding narrowed to duration, vibe and companions",
        "Swipeable deck of curated Ottawa spots",
        "Saves, one-tap directions and a shortlist view",
    ],
    outcome:
        "A focused discovery flow that gets from “I don't know” to directions in a few taps, built to expand to more Canadian cities. Just select your time, vibe and companions, swipe through a curated deck of spots, save your favourites and get one-tap directions.",
    // Scope metrics: known facts about the build. Swap for measured analytics when available.
    metrics: [
        { value: "35+", label: "places to discover in Ottawa" },
        { value: "Personal", label: "idea based on real-life experiences" },
        { value: "Location-based", label: "share location to find nearby spots" },
    ],
    gallery: [
        {
            src: "/find-your-spot/solution.webp",
            alt: "Discovery flow with a swipeable deck of curated spots",
        },
        {
            src: "/find-your-spot/results.webp",
            alt: "Saved shortlist with one-tap directions",
        },
        {
            src: "/find-your-spot/problem.webp",
            alt: "Selecting time, vibe and companions to narrow down the search",
        },
    ],
    techStack: ["React", "JavaScript", "Tailwind CSS", "Vite"],
    liveUrl: "https://find-your-spot-ca.vercel.app/",
    githubUrl: "https://github.com/Camperkunz/Find-Your-Spot",
    featured: true,
};

export default findYourSpot;
