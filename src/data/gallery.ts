import manifest from "./image-manifest.json";

export type GalleryCategory = "residential" | "commercial" | "civil";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: GalleryCategory;
  /** Sub-group used for section headings and the lightbox caption. */
  set: string;
};

type ManifestEntry = { src: string; width: number; height: number };
const images = manifest as Record<string, ManifestEntry[]>;

/**
 * The source folders were named by whoever uploaded them ("hii", "celing",
 * "kichten", "livinig", "SUMERUU"). This maps them onto the three categories
 * the site actually filters by, and supplies real alt text — the legacy
 * gallery shipped 40+ <img> tags with no alt attribute at all.
 */
const SETS: {
  key: string;
  set: string;
  category: GalleryCategory;
  alt: string;
}[] = [
  { key: "projects/living", set: "Living rooms", category: "residential", alt: "Living room interior with built-in wall unit and cove lighting" },
  { key: "projects/bedroom", set: "Bedrooms", category: "residential", alt: "Bedroom interior with fitted wardrobe and headboard panelling" },
  { key: "projects/kitchen", set: "Kitchens", category: "residential", alt: "Modular kitchen with fitted cabinetry and counter" },
  { key: "projects/ceiling", set: "Ceilings & lighting", category: "residential", alt: "False ceiling detail with recessed and cove lighting" },
  { key: "projects/furniture", set: "Joinery & furniture", category: "residential", alt: "Custom joinery — fitted storage and furniture" },
  { key: "projects/interiors", set: "Full-home interiors", category: "residential", alt: "Completed residential interior" },
  { key: "projects/utkarsh-bank", set: "Bank branch", category: "commercial", alt: "Bank branch interior with workstations and meeting rooms" },
  { key: "projects/sumeru", set: "Restaurant", category: "commercial", alt: "Restaurant interior with feature lighting and bar seating" },
  { key: "projects/bar", set: "Bar & lounge", category: "commercial", alt: "Bar interior with pendant lighting and counter" },
  { key: "projects/commercial", set: "Office fit-outs", category: "commercial", alt: "Commercial office fit-out interior" },
  { key: "projects/construction", set: "Civil works", category: "civil", alt: "Civil construction site — structure and masonry work" },
];

export const photos: Photo[] = SETS.flatMap(({ key, set, category, alt }) =>
  (images[key] ?? []).map((img, i) => ({
    ...img,
    set,
    category,
    alt: `${alt} — ${set.toLowerCase()} project ${i + 1}`,
  })),
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
    "Completed residential interior by Sri Pushkar Interiors",
    "Interior fit-out in progress on a Mumbai site",
    "Finished living space with custom joinery",
  ][i] ?? "Project photograph",
}));

export const partnerLogos = images["partners"] ?? [];

/**
 * Hand-picked for the home page.
 *
 * Deliberately not algorithmic: the source library is a decade of phone
 * uploads of wildly uneven quality, so "first photo in each folder" reliably
 * surfaced the worst ones. These are chosen for how they read at tile size.
 */
const FEATURED_SRC = [
  "/images/projects/commercial/commercial-06.webp", // sculptural column ceiling
  "/images/projects/living/living-11.webp", // teal sectional
  "/images/projects/ceiling/ceiling-17.webp", // gold cove ceiling
  "/images/projects/utkarsh-bank/utkarsh-bank-04.webp", // conference room
  "/images/projects/sumeru/sumeru-13.webp", // bar with pendants
  "/images/projects/construction/construction-84.webp", // arched roof structure
  "/images/projects/kitchen/kitchen-06.webp", // modular kitchen
  "/images/projects/interiors/interiors-14.webp", // geometric feature wall
];

const bySrc = new Map(photos.map((p) => [p.src, p]));

export const featuredPhotos: Photo[] = FEATURED_SRC.map((src) => bySrc.get(src)).filter(
  (p): p is Photo => Boolean(p),
);

/**
 * Display order for the gallery: the hand-picked images first, so the opening
 * rows are the strongest work rather than whichever folder sorted first.
 */
const featuredSet = new Set(FEATURED_SRC);
export const galleryPhotos: Photo[] = [
  ...featuredPhotos,
  ...photos.filter((p) => !featuredSet.has(p.src)),
];
