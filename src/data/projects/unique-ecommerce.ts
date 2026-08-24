import { Project } from "@/types/portfolio";

const uniqueEcommerce: Project = {
    id: "unique-ecommerce",
    title: "Shopify E-Commerce Store",
    shortDescription: "A custom Shopify store designed for a small fabric business to relaunch their online presence and convert social media traffic into sales.",
    fullDescription:
        "This project focused on rebuilding the online presence of a small fabric business whose previous website was outdated and difficult to use. The goal was to migrate the brand from primarily selling through social media to a fully functional online store. I designed the entire website and built the store on Shopify, focusing on clear product presentation, intuitive navigation, and strong SEO foundations.",
    thumbnailImageUrl: "/unique/unique-website.jpg", // ← this is the small thumbnail image for the project, used in the projects section
    imageUrl: "/unique/unique-website.jpg", // ← this is the main image for the project, hero image on the project page
    overviewImageUrl: "/unique/unique-website.jpg", // ← inside the component, first
    year: "2025",
    category: "Frontend Development",
    highlights: [
        "Designed the complete UI and structure of the e-commerce store",
        "Built and customized a Shopify theme using Liquid",
        "Created custom sections and code blocks for additional flexibility",
        "Implemented SEO best practices for improved search visibility",
    ],
    problem: "The business relied mostly on social media to sell products, while their existing website was outdated, slow, and difficult to navigate. It failed to properly showcase the products and did not support a smooth online shopping experience.",
    problemImageUrl: "/unique/problem.jpg", // ← replace
    solution: "I redesigned the entire website and migrated the store to Shopify, creating a clean and intuitive shopping experience. The project included designing the layout, improving the content structure, organizing collections, and implementing SEO strategies. Custom Liquid code and theme modifications were used to adapt the Shopify theme to the specific needs of the business and allow more flexibility in presenting products.",
    solutionImageUrl: "/unique/solution.jpg", // ← replace
    results: "The new website provides the business with a modern, professional online store that properly showcases their products and supports online sales. The improved structure, SEO optimization, and clear product organization make it easier for customers to discover fabrics and complete purchases, while giving the business a scalable platform for future growth.",
    resultsImageUrl: "/unique/results.jpg", // ← replace
    techStack: ["Shopify", "Figma", "HTML", "CSS"],
    liveUrl: "https://uniquefabricpanels.com/",
    // 
    featured: true,
};

export default uniqueEcommerce;
