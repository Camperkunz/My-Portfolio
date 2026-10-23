import { Project } from "@/types/portfolio";

import portfolio from "./portfolio";
import uniqueEcommerce from "./unique-ecommerce";
import cicanCampusLivingLabs from "./cican-campus-living-labs";
import loopstudios from "./loopstudios";
import contactBook from "./contact-book";
import advocacyCaot from "./advocacy-caot";
import notificationsApp from "./notifications-app";
import findYourSpot from "./find-your-spot";
import dianaWedding from "./diana-wedding";

// Order here controls display order across the site.
// The first FEATURED_COUNT entries also fill the two rows of the home page grid
// (see components/portfolio/sections/ProjectsSection.tsx).
export const projects: Project[] = [
    uniqueEcommerce,
    dianaWedding,
    findYourSpot,
    cicanCampusLivingLabs,
    portfolio,
    advocacyCaot,
    loopstudios,
    contactBook,
    notificationsApp,
];
