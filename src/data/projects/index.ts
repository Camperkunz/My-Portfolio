import { Project } from "@/types/portfolio";

import portfolio from "./portfolio";
import uniqueEcommerce from "./unique-ecommerce";
import cicanCampusLivingLabs from "./cican-campus-living-labs";
import loopstudios from "./loopstudios";
import contactBook from "./contact-book";
import advocacyCaot from "./advocacy-caot";
import notificationsApp from "./notifications-app";
import findYourSpot from "./find-your-spot";

// Order here controls display order across the site.
export const projects: Project[] = [
    portfolio,
    uniqueEcommerce,
    cicanCampusLivingLabs,
    loopstudios,
    contactBook,
    advocacyCaot,
    notificationsApp,
    findYourSpot
];
