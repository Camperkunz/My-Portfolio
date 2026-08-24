const NAVBAR_HEIGHT = 64;

export const navigateToSection = (
    href: string,
    currentPathname: string
) => {
    // If we're on a project/other page, go to the homepage
    // and let the hash navigate to the section.
    if (currentPathname !== "/") {
        window.location.href = `/${href}`;
        return;
    }

    // We're already on the homepage — smooth scroll to the section.
    const element = document.querySelector(href);

    if (!element) {
        return;
    }

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition =
        elementPosition + window.pageYOffset - NAVBAR_HEIGHT;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
};