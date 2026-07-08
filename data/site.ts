// =============================================================
//  SITE CONTENT — everything editable lives in this file.
//  Update names, links, apps and images here; no need to touch
//  any component code.
// =============================================================

// -------------------- Types --------------------

export type AppProject = {
  id: string;
  name: string;
  /** Poster image (1:2 ratio, e.g. 400×800). Drop the file into
   *  public/project/poster/ and set "/project/poster/<id>.png" here.
   *  Left empty, a gradient placeholder is rendered. */
  poster?: string;
  /** Optional second poster → the card becomes double-width and
   *  shows both images side by side. */
  poster2?: string;
  /** Empty = grayed-out "not available" badge. */
  appStoreUrl?: string;
  playStoreUrl?: string;
  /** true = built with a team/company → shown under the team section */
  team?: boolean;
  /** Small muted note under the app name, e.g. "Bakcell" */
  company?: string;
  /** true = app is no longer live in production → store badges are
   *  replaced by a "No longer in production" note. */
  retired?: boolean;
  /** Small app logo shown inside the retired note.
   *  Drop the file into public/project/logo/ and set "/project/logo/<id>.png". */
  logo?: string;
};

export type PackageProject = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export type OtherProject = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export type RetiredApp = {
  id: string;
  name: string;
  /** Optional muted note after the name, e.g. "Azerconnect" */
  company?: string;
  /** Optional logo under public/project/logo/ (any ratio — height is
   *  normalized). Omit it for a text-only chip. */
  logo?: string;
};

export type GalleryPhoto = {
  /** Image inside public/gallery/ — drop your own photos and update src */
  src: string;
  location: string;
  subtitle?: string;
};

export type SocialKey = "instagram" | "x" | "linkedin" | "youtube" | "github";

// -------------------- Profile --------------------

export const profile = {
  name: "Elnur Qasimov",
  /** Big hero heading */
  role: "Senior Mobile Engineer",
  /** Blue handwritten line under the heading */
  tagline: "30+ apps across iOS, Android & web",
  available: true,
  location: "Baku, Azerbaijan",
  email: "elnurgasimovv@gmail.com",
  /** After adding public/avatar.jpg set "/avatar.jpg" — empty renders a gradient circle */
  avatar: "/avatar.jpg",
  /** After adding public/resume.pdf set "/resume.pdf" — empty hides the résumé row */
  resumeUrl: "",
};

// -------------------- Social links --------------------
// Empty strings are hidden (both hero icons and contact rows).

export const socials: Record<SocialKey, string> = {
  instagram: "",
  x: "",
  linkedin: "https://www.linkedin.com/in/elnur-gasimov-a0b30b20b",
  youtube: "",
  github: "",
};

// -------------------- Contact card --------------------

export const contact = {
  heading: "let’s work together",
  /** Segments with bold: true render emphasized */
  blurb: [
    { text: "I’ve built " },
    { text: "30+ apps & games", bold: true },
    { text: " across iOS and Android, backed by " },
    { text: "shared packages", bold: true },
    { text: " and a " },
    { text: "product-first", bold: true },
    { text: " approach. I take " },
    { text: "freelance and contract work", bold: true },
    { text: "." },
  ],
};

// -------------------- Apps tab --------------------
//  Paste real store links — empty ones show a grayed-out badge.
//  Two groups: solo apps (default) and team/company work (team: true).
//  Section headings below are editable too.

export const appSections = {
  solo: "my own apps",
  team: "team & company work",
  /** Label above the retired-app logo chips under the team group */
  retired: "no longer in production",
};

/** Row layout of the team group on desktop: cards per row, top to bottom.
 *  Apps are taken from the team list in order. Incomplete rows are centered. */
export const teamRows = [3, 2, 2];

export const apps: AppProject[] = [
  // ---- Built solo ----
  {
    id: "patches",
    name: "Patches",
    poster: "/project/poster/patches-1.jpg",
    poster2: "/project/poster/patches-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/patches-block-pattern-puzzle/id6761279876",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ols.patches",
  },
  {
    id: "mergio",
    name: "Mergio: 2048 Block Blast",
    poster: "/project/poster/mergio-1.jpg",
    poster2: "/project/poster/mergio-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/mergio-2048-block-blast/id6761683154",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ols.numboom",
  },
  {
    id: "wend",
    name: "Wend",
    poster: "/project/poster/wend-1.jpg",
    poster2: "/project/poster/wend-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/wend-word-path-puzzle/id6779597626",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ols.wend",
  },
  {
    id: "tango",
    name: "Tango",
    poster: "/project/poster/tango-1.jpg",
    poster2: "/project/poster/tango-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/tango-sun-moon-logic-puzzle/id6771048392",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ols.tango",
  },
  {
    id: "admobpulse",
    name: "AdMob Pulse",
    poster: "/project/poster/admobpulse-1.jpg",
    poster2: "/project/poster/admobpulse-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/admob-pulse-earnings-tracker/id6766039813",
    playStoreUrl: "",
  },
  {
    id: "habitiz",
    name: "Habitiz",
    poster: "/project/poster/habitiz-1.jpg",
    poster2: "/project/poster/habitiz-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/habit-tracker-habitiz/id6741783563",
    playStoreUrl: "",
  },
  {
    id: "turboscanner",
    name: "TurboScanner",
    poster: "/project/poster/turboscanner-1.jpg",
    poster2: "/project/poster/turboscanner-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/turboscanner-ai-scan-to-pdf/id6760856920",
    playStoreUrl: "",
  },
  {
    id: "wearme",
    name: "WearMe",
    poster: "/project/poster/wearme-1.jpg",
    poster2: "/project/poster/wearme-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/wearme-ai-virtual-try-on/id6746399999",
    playStoreUrl: "",
  },
  {
    id: "whichone-ai",
    name: "WhichOne AI",
    poster: "/project/poster/whichone-ai-1.jpg",
    poster2: "/project/poster/whichone-ai-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/photo-comparison-whichone-ai/id6744938398",
    playStoreUrl: "",
  },
  {
    id: "zip",
    name: "Zip",
    poster: "/project/poster/zip-1.jpg",
    poster2: "/project/poster/zip-2.jpg",
    appStoreUrl: "https://apps.apple.com/us/app/zip-path-logic-puzzle/id6771046628",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ols.zip",
  },

  // ---- Built with teams / companies (team: true) ----
  {
    id: "bakcell",
    name: "Bakcell",
    team: true,
    company: "Bakcell",
    poster: "/project/poster/bakcell-1.jpg",
    poster2: "/project/poster/bakcell-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/bakcell/id6443623307",
    playStoreUrl: "",
  },
  {
    id: "citynet",
    name: "CityNet",
    team: true,
    company: "CityNet",
    poster: "/project/poster/citynet-1.webp",
    poster2: "/project/poster/citynet-2.webp",
    appStoreUrl: "https://apps.apple.com/az/app/citynet/id1663684554",
    playStoreUrl: "",
  },
  {
    id: "salesapp",
    name: "SalesApp",
    team: true,
    company: "Azerconnect",
    poster: "/project/poster/salesapp-1.webp",
    poster2: "/project/poster/salesapp-2.webp",
    appStoreUrl: "",
    playStoreUrl: "https://play.google.com/store/apps/details?id=az.azerconnect.salesapp",
  },
  {
    id: "rabita-mobile",
    name: "Rabita Mobile",
    team: true,
    company: "Rabitabank",
    poster: "/project/poster/rabita-mobile-1.jpg",
    poster2: "/project/poster/rabita-mobile-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/rabita-mobile/id1457972986",
    playStoreUrl: "",
  },
  {
    id: "rabita-business",
    name: "Rabita Business",
    team: true,
    company: "Rabitabank",
    poster: "/project/poster/rabita-business-1.jpg",
    poster2: "/project/poster/rabita-business-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/rabita-business/id6443393421",
    playStoreUrl: "",
  },
  {
    id: "buylink",
    name: "BuyLink",
    team: true,
    retired: true,
    logo: "/project/logo/buylink.png",
    poster: "/project/poster/buylink-1.jpg",
    poster2: "/project/poster/buylink-2.jpg",
    appStoreUrl: "",
    playStoreUrl: "",
  },
  {
    id: "uup-anonymous",
    name: "Uup Anonymous",
    team: true,
    company: "Noacco",
    poster: "/project/poster/uup-anonymous-1.jpg",
    poster2: "/project/poster/uup-anonymous-2.jpg",
    appStoreUrl: "https://apps.apple.com/az/app/uup-anonymous/id1633250443",
    playStoreUrl: "",
  },
];

// -------------------- Retired apps (logo chips) --------------------
//  Apps that were taken out of production — shown as one logo+name chip
//  row at the very bottom of the Apps tab. Scales to any count: drop the
//  logo into public/project/logo/ and add one line here.

export const retiredApps: RetiredApp[] = [
  { id: "anipay", name: "AniPay", logo: "/project/logo/anipay.png" },
  { id: "inside", name: "Inside", logo: "/project/logo/inside.png" },
  { id: "suyumaz", name: "Suyumaz" },
  { id: "staffco", name: "StaffCo", logo: "/project/logo/staffco.png" },
  { id: "hesablacom", name: "Hesabla.com", logo: "/project/logo/hesablacom.png" },
  { id: "1termin", name: "1Termin" },
  { id: "cibim", name: "Cibim" },
  { id: "infopulse", name: "InfoPulse AI" },
  { id: "recur", name: "Recur" },
  { id: "endirim", name: "Endirim" },
  { id: "willaz", name: "Will.az" },
  { id: "neural-id", name: "Neural ID" },
];

// -------------------- Packages tab --------------------

export const packages: PackageProject[] = [
  {
    id: "ols-design-system",
    name: "ols_design_system",
    description: "Shared design system: colors, text styles, buttons and reusable widgets.",
    link: "https://github.com/OlaaSoft",
  },
  {
    id: "ols-firebase",
    name: "ols_firebase",
    description: "Firebase bootstrap layer shared by every OlaaSoft app.",
    link: "https://github.com/OlaaSoft",
  },
  {
    id: "ols-leaderboard",
    name: "ols_leaderboard",
    description: "Firestore-backed weekly & lifetime leaderboards for games.",
    link: "https://github.com/OlaaSoft",
  },
  {
    id: "ols-cross-promo",
    name: "ols_cross_promo",
    description: "Firestore-managed cross-promo catalog between apps.",
    link: "https://github.com/OlaaSoft",
  },
  {
    id: "ols-adapty",
    name: "ols_adapty",
    description: "Adapty paywall & subscription integration package.",
    link: "https://github.com/OlaaSoft",
  },
];

// -------------------- Other tab --------------------

export const other: OtherProject[] = [
  {
    id: "release-dashboard",
    name: "Release Dashboard",
    description: "Next.js dashboard tracking releases across the whole app portfolio.",
    link: "https://github.com/OlaaSoft",
  },
  {
    id: "adapty-webhook-worker",
    name: "Adapty Webhook Worker",
    description: "Cloudflare Worker processing subscription webhook events.",
    link: "https://github.com/OlaaSoft",
  },
  {
    id: "shorts-factory",
    name: "Shorts Factory",
    description: "Automated pipeline that renders and publishes short-form videos.",
    link: "https://github.com/OlaaSoft",
  },
];

// -------------------- Gallery (photo marquee) --------------------
//  Empty list = the whole photo marquee section is hidden.
//  To bring it back: drop photos into public/gallery/ and add entries:
//  { src: "/gallery/vienna.jpg", location: "Vienna", subtitle: "Austria" },
//  Clicking a photo opens the Instagram link (no link if socials.instagram
//  is empty).

export const gallery: GalleryPhoto[] = [];
