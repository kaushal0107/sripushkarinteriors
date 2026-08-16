export const site = {
  name: "Meridian Interiors",
  legalName: "Meridian Interiors & Contracts",
  tagline: "Interior design, fit-out and civil contracting in Pune",
  description:
    "Turnkey interior design and civil contracting in Pune. Residential interiors, commercial fit-outs and construction handled end to end — design, materials, labour and supervision.",
  url: "https://meridian-interiors.example",
  founded: 2009,
  phones: [
    { display: "+91 98765 43210", href: "tel:+919876543210" },
    { display: "+91 98765 43211", href: "tel:+919876543211" },
  ],
  email: "hello@meridian-interiors.example",
  address: {
    street: "Unit 12, Sundale Business Park",
    city: "Pune",
    region: "Maharashtra",
    postalCode: "411001",
    country: "IN",
  },
  mapQuery: "Sundale Business Park, Pune, Maharashtra 411001",
  social: [{ label: "Instagram", href: "https://instagram.example/meridian" }],
  isDemo: true,
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
] as const;

export const stats = [
  { value: "15+", label: "Years in practice", detail: "Building in Pune since 2009" },
  { value: "300+", label: "Projects delivered", detail: "Homes, offices, retail and civil" },
  { value: "100%", label: "Turnkey", detail: "Design through handover, one contract" },
  { value: "1 yr", label: "Workmanship warranty", detail: "Materials per manufacturer terms" },
] as const;

export const values = [
  {
    title: "One contract, start to finish",
    body: "Design, materials, labour and site supervision sit under a single scope. You are not left coordinating between an architect, a carpenter and three vendors who blame each other.",
  },
  {
    title: "Priced from a bill of quantities",
    body: "Every quote is itemised — brand, finish, dimension and rate, line by line. You can see what a change costs before you approve it, and nothing appears on the final bill that was not on the first one.",
  },
  {
    title: "Drawings before demolition",
    body: "Layouts, elevations and services drawings are signed off before anyone lifts a hammer. Changing a line on paper costs nothing; changing a built wall costs weeks.",
  },
  {
    title: "Our own site team",
    body: "Carpentry, false ceiling, electrical and painting crews are people we have worked with for years, not whoever was free that week. It is the reason the finishing holds up.",
  },
  {
    title: "Weekly progress you can see",
    body: "Photographs and a written update every week, against the dated schedule agreed at the start. If something has slipped you hear it from us first.",
  },
  {
    title: "We finish the snag list",
    body: "Handover is not the last day on site. The defects list gets closed out, and we answer the phone for a year afterwards when something needs attention.",
  },
] as const;

export const services = [
  {
    slug: "residential",
    title: "Residential interiors",
    summary:
      "Full-home interiors for flats and row houses — modular kitchens, wardrobes, false ceilings, lighting, flooring and finishing.",
    detail:
      "We take a bare or tired flat and hand it back finished. That means layouts and 3D views you can actually judge, then the unglamorous part done properly: plumbing and electrical routed before the ceiling closes, carpentry built to the millimetre of a measured site, and a paint finish that does not show the joints.",
    scope: [
      "Modular kitchens and wardrobes",
      "False ceilings and cove lighting",
      "TV units, wall panelling and partitions",
      "Flooring, tiling and dado work",
      "Electrical, plumbing and painting",
    ],
    gallery: "residential",
  },
  {
    slug: "commercial",
    title: "Commercial fit-outs",
    summary:
      "Offices, bank branches, showrooms and restaurants — built to brand standards and delivered against a dated handover schedule.",
    detail:
      "Commercial work lives or dies on the schedule, because every week past handover is rent paid on an empty floor. We plan around that: procurement ordered before demolition starts, services and IT infrastructure coordinated with your vendors, and night or weekend working where an operating branch cannot close.",
    scope: [
      "Bank branches and back offices",
      "Workstations, cabins and conference rooms",
      "Retail and showroom interiors",
      "Restaurants, cafés and bars",
      "Washroom and pantry fit-outs",
    ],
    gallery: "commercial",
  },
  {
    slug: "civil",
    title: "Civil & construction",
    summary:
      "RCC structure, masonry, plaster and external work — from footings and slabs through to a weather-tight, finished shell.",
    detail:
      "The structural side of the practice: excavation, footings, columns, slabs and masonry, executed to the consultant's drawings with the reinforcement checked before the pour. We also take on additions, terrace work and external repair on existing buildings.",
    scope: [
      "RCC footings, columns and slabs",
      "Brick and block masonry",
      "Internal and external plaster",
      "Waterproofing and terrace work",
      "Site development and external works",
    ],
    gallery: "civil",
  },
  {
    slug: "turnkey",
    title: "Turnkey project management",
    summary:
      "One agreement covering design, procurement, execution and handover — with a single person accountable for the date.",
    detail:
      "Turnkey is how most of our work is contracted. We price the whole job from a bill of quantities, order and store the material, run the trades in sequence, and hand over a space you can use on the agreed date. You approve drawings and payments; we chase the vendors.",
    scope: [
      "Design and drawing sign-off",
      "Bill of quantities and fixed pricing",
      "Material procurement and storage",
      "Trade sequencing and site supervision",
      "Snagging, handover and defects period",
    ],
    gallery: "all",
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Site visit and brief",
    body: "We measure the space, understand how you want to use it, and talk honestly about what the budget will and will not cover. No charge, no obligation.",
  },
  {
    step: "02",
    title: "Layout and estimate",
    body: "You get a floor plan, indicative views and an itemised bill of quantities. This is the stage to argue about finishes and move walls — it is free to change here.",
  },
  {
    step: "03",
    title: "Drawings and sign-off",
    body: "Once the scope is agreed we issue working drawings — elevations, electrical, plumbing and ceiling layouts — and a dated schedule. Both get signed before site starts.",
  },
  {
    step: "04",
    title: "Execution",
    body: "Material arrives ahead of each trade, work runs in sequence, and you get photographs and a written progress note every week against that schedule.",
  },
  {
    step: "05",
    title: "Snagging and handover",
    body: "We walk the site with you, write down everything that is not right, and close it out. Then we hand over keys, warranty documents and the as-built drawings.",
  },
  {
    step: "06",
    title: "Defects period",
    body: "For a year after handover, workmanship issues are ours to fix. Material warranties run per the manufacturer's terms, and we help you claim them.",
  },
] as const;

export const team = [
  {
    name: "Aditi Raman",
    initials: "AR",
    role: "Founder & principal contractor",
    bio: "Runs site execution and holds the schedule. Has been contracting in Pune since before the firm was formed in 2009.",
  },
  {
    name: "Vikram Sethi",
    initials: "VS",
    role: "Design lead",
    bio: "Owns layouts, elevations and material selection — the drawings that get signed before anyone starts breaking walls.",
  },
  {
    name: "Nisha Kulkarni",
    initials: "NK",
    role: "Procurement & site management",
    bio: "Sources material, negotiates with vendors, and keeps the bill of quantities honest between estimate and final bill.",
  },
] as const;

export const clients = [
  "Northbank",
  "Corvus Group",
  "Almora Hotels",
  "Vantage Labs",
  "Peregrine Retail",
  "Tessellate",
] as const;

export const faqs = [
  {
    q: "How is a turnkey project priced?",
    a: "From an itemised bill of quantities. Every line names the item, brand or equivalent, finish, quantity and rate — so the total is something you can check rather than take on trust. The price holds unless you change the scope, and any change is re-quoted in writing before we act on it.",
  },
  {
    q: "How long does a full-home interior take?",
    a: "A 2BHK flat typically runs 45–60 working days from drawing sign-off, a 3BHK closer to 75. Commercial fit-outs depend far more on the size of the floor plate and whether the premises can be shut. We commit to a dated schedule before starting and report against it weekly.",
  },
  {
    q: "Do you work on a single room or only full projects?",
    a: "Both. A modular kitchen, a set of wardrobes or a false ceiling on its own is normal work for us. Below roughly ₹1.5 lakh of scope it is usually more economical for you to engage a carpenter directly, and we will tell you that rather than quote for it.",
  },
  {
    q: "What is covered by the warranty?",
    a: "One year on our workmanship — carpentry joints, ceiling, electrical and paint finish. Materials carry whatever the manufacturer offers, typically five to ten years on modular hardware and boards; we hand over those documents at handover and help you raise a claim if needed.",
  },
  {
    q: "Do you handle society permissions and approvals?",
    a: "We prepare the drawings and undertakings most housing societies ask for, and our site supervisor deals with the committee on working hours, debris removal and lift usage. The application itself has to come from you as the owner.",
  },
  {
    q: "What are the payment stages?",
    a: "Typically 10% on drawing sign-off, 40% on material procurement, 30% at mid-execution, 15% before handover and the final 5% after the snag list is closed. The exact schedule goes into the contract before any money changes hands.",
  },
] as const;
