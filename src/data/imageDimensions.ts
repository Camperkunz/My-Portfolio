// Intrinsic dimensions of public images (generated via sharp).
// Used as width/height attributes to reserve layout space and avoid CLS,
// while CSS (object-cover / aspect ratios) keeps the visual crop.
export const imageDimensions: Record<string, { w: number; h: number }> = {
  "/advocacy/advocacy.webp": { w: 1515, h: 1069 },
  "/advocacy/problem.webp": { w: 1299, h: 824 },
  "/advocacy/results.webp": { w: 1302, h: 862 },
  "/advocacy/solution.webp": { w: 1305, h: 868 },
  "/anna-photo.webp": { w: 512, h: 768 },
  "/cican/overview.webp": { w: 1366, h: 679 },
  "/cican/problem.webp": { w: 1366, h: 620 },
  "/cican/results.webp": { w: 1366, h: 704 },
  "/cican/solution.webp": { w: 1366, h: 711 },
  "/contact-book/contact-book.webp": { w: 1219, h: 739 },
  "/contact-book/problem.webp": { w: 1202, h: 762 },
  "/contact-book/results.webp": { w: 1248, h: 755 },
  "/contact-book/solution.webp": { w: 1273, h: 829 },
  "/favicon-black.webp": { w: 100, h: 100 },
  "/favicon.webp": { w: 100, h: 100 },
  "/find-your-spot/overview.webp": { w: 1250, h: 731 },
  "/find-your-spot/problem.webp": { w: 1250, h: 731 },
  "/find-your-spot/results.webp": { w: 1250, h: 731 },
  "/find-your-spot/solution.webp": { w: 1250, h: 731 },
  "/find-your-spot/thumbnail.webp": { w: 1250, h: 731 },
  "/loop-studios/loopstudios.webp": { w: 1903, h: 1079 },
  "/loop-studios/problem.webp": { w: 1358, h: 768 },
  "/loop-studios/results.webp": { w: 1355, h: 768 },
  "/loop-studios/solution.webp": { w: 1352, h: 768 },
  "/notification/notifications.webp": { w: 1618, h: 977 },
  "/notification/overview.webp": { w: 1253, h: 797 },
  "/notification/problem.webp": { w: 1248, h: 824 },
  "/notification/results.webp": { w: 1191, h: 788 },
  "/notification/solution.webp": { w: 1227, h: 842 },
  "/portfolio/overview.webp": { w: 1354, h: 768 },
  "/portfolio/portfolio.webp": { w: 1899, h: 1079 },
  "/portfolio/problem.webp": { w: 1350, h: 768 },
  "/portfolio/solution.webp": { w: 1353, h: 768 },
  "/unique/problem.webp": { w: 1353, h: 768 },
  "/unique/results.webp": { w: 1354, h: 768 },
  "/unique/solution.webp": { w: 1353, h: 768 },
  "/unique/unique-website.webp": { w: 1901, h: 1079 },
};

export function imgSize(src: string | undefined) {
  if (!src) return undefined;
  return imageDimensions[src];
}
