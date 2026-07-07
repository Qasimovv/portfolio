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

export type MoreApp = {
  id: string;
  name: string;
  /** Optional muted note after the name, e.g. "Azerconnect" */
  company?: string;
  /** Logo file under public/project/logo/ (any ratio — height is normalized) */
  logo: string;
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
  tagline: "20+ apps across iOS, Android & web",
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
    { text: "20+ apps & games", bold: true },
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
  /** Label above the logo chips under the team group */
  more: "…and more apps I’ve worked on",
};

export const apps: AppProject[] = [
  // ---- Built solo ----
  { id: "patches", name: "Patches", appStoreUrl: "", playStoreUrl: "" },
  { id: "mergio", name: "Mergio: 2048 Block Blast", appStoreUrl: "", playStoreUrl: "" },
  { id: "wend", name: "Wend", appStoreUrl: "", playStoreUrl: "" },
  { id: "tango", name: "Tango", appStoreUrl: "", playStoreUrl: "" },
  { id: "recur", name: "Recur", appStoreUrl: "", playStoreUrl: "" },
  { id: "admobpulse", name: "AdMob Pulse", appStoreUrl: "", playStoreUrl: "" },
  { id: "infopulse", name: "InfoPulse AI", appStoreUrl: "", playStoreUrl: "" },

  // ---- Built with teams / companies (team: true) ----
  {
    id: "bakcell",
    name: "Bakcell",
    team: true,
    company: "Bakcell",
    poster: "/project/poster/bakcell-1.jpg",
    poster2: "/project/poster/bakcell-2.jpg",
    appStoreUrl: "",
    playStoreUrl: "",
  },
  {
    id: "citynet",
    name: "CityNet",
    team: true,
    company: "CityNet",
    poster: "/project/poster/citynet-1.webp",
    poster2: "/project/poster/citynet-2.webp",
    appStoreUrl: "",
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
    playStoreUrl: "",
  },
  {
    id: "rabita-mobile",
    name: "Rabita Mobile",
    team: true,
    company: "Rabitabank",
    poster: "/project/poster/rabita-mobile-1.jpg",
    poster2: "/project/poster/rabita-mobile-2.jpg",
    appStoreUrl: "",
    playStoreUrl: "",
  },
  {
    id: "rabita-business",
    name: "Rabita Business",
    team: true,
    company: "Rabitabank",
    poster: "/project/poster/rabita-business-1.jpg",
    poster2: "/project/poster/rabita-business-2.jpg",
    appStoreUrl: "",
    playStoreUrl: "",
  },
  {
    id: "uup-anonymous",
    name: "Uup Anonymous",
    team: true,
    company: "Noacco",
    retired: true,
    poster: "/project/poster/uup-anonymous-1.jpg",
    poster2: "/project/poster/uup-anonymous-2.jpg",
    appStoreUrl: "",
    playStoreUrl: "",
  },
];

// -------------------- More team apps (logo chips) --------------------
//  Apps shown as small logo+name chips under the team group.
//  Scales to any count: drop the logo into public/project/logo/ and add
//  one line here.

export const moreApps: MoreApp[] = [
  { id: "anipay", name: "AniPay", logo: "/project/logo/anipay.png" },
  { id: "buylink", name: "BuyLink", logo: "/project/logo/buylink.png" },
  { id: "inside", name: "Inside", logo: "/project/logo/inside.png" },
  { id: "suyumaz", name: "Suyumaz", logo: "/project/logo/suyumaz.png" },
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
//  Drop your own photos into public/gallery/ and update the src fields.
//  Clicking a photo opens the Instagram link (no link if socials.instagram
//  is empty).

export const gallery: GalleryPhoto[] = [
  { src: "/gallery/g1.svg", location: "Baku", subtitle: "Azerbaijan" },
  { src: "/gallery/g2.svg", location: "Old City", subtitle: "İçərişəhər" },
  { src: "/gallery/g3.svg", location: "Shahdag", subtitle: "Winter trip" },
  { src: "/gallery/g4.svg", location: "Gabala", subtitle: "Azerbaijan" },
  { src: "/gallery/g5.svg", location: "Sheki", subtitle: "Azerbaijan" },
  { src: "/gallery/g6.svg", location: "Caspian Sea", subtitle: "Sunset" },
  { src: "/gallery/g7.svg", location: "Quba", subtitle: "Azerbaijan" },
  { src: "/gallery/g8.svg", location: "Ganja", subtitle: "Azerbaijan" },
];
