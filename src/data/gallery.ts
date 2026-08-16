import manifest from "./image-manifest.json";

export type GalleryCategory = "residential" | "commercial" | "civil";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: GalleryCategory;
  set: string;
};

type ManifestEntry = { src: string; width: number; height: number };
const images = manifest as Record<string, ManifestEntry[]>;

const SETS: Record<GalleryCategory, string[]> = {
  residential: ["Living spaces", "Kitchens", "Joinery & storage", "Ceilings & lighting"],
  commercial: ["Workplace", "Retail & hospitality", "Banking halls"],
  civil: ["Structure", "Facades", "Site works"],
};

const CATEGORY_ORDER: GalleryCategory[] = ["residential", "commercial", "civil"];

export const photos: Photo[] = CATEGORY_ORDER.flatMap((category) =>
  (images[`projects/${category}`] ?? []).map((img, i) => {
    const sets = SETS[category];
    const set = sets[i % sets.length];
    return {
      ...img,
      category,
      set,
      alt: `Illustration of a ${category} project — ${set.toLowerCase()}, composition ${i + 1}`,
    };
  }),
);

export const categories: { value: GalleryCategory | "all"; label: string; count: number }[] = [
  { value: "all", label: "All work", count: photos.length },
  { value: "residential", label: "Residential", count: photos.filter((p) => p.category === "residential").length },
  { value: "commercial", label: "Commercial", count: photos.filter((p) => p.category === "commercial").length },
  { value: "civil", label: "Civil", count: photos.filter((p) => p.category === "civil").length },
];

export const heroImages = (images["hero"] ?? []).map((img, i) => ({
  ...img,
  alt: [
    "Illustration of a finished interior — pendant lighting over a seating area",
    "Illustration of an arched colonnade in a commercial space",
    "Illustration of a building facade with a grid of openings",
  ][i] ?? "Architectural illustration",
}));

const FEATURED_SRC = [
  "/images/projects/commercial/commercial-01.webp",
  "/images/projects/residential/residential-03.webp",
  "/images/projects/civil/civil-03.webp",
  "/images/projects/commercial/commercial-05.webp",
  "/images/projects/residential/residential-05.webp",
  "/images/projects/civil/civil-01.webp",
  "/images/projects/commercial/commercial-09.webp",
  "/images/projects/residential/residential-09.webp",
];

const bySrc = new Map(photos.map((p) => [p.src, p]));

export const featuredPhotos: Photo[] = FEATURED_SRC.map((src) => bySrc.get(src)).filter(
  (p): p is Photo => Boolean(p),
);

const featuredSet = new Set(FEATURED_SRC);
export const galleryPhotos: Photo[] = [
  ...featuredPhotos,
  ...photos.filter((p) => !featuredSet.has(p.src)),
];
