// =============================================================
//  SITE CONTENT — bütün məzmun buradadır.
//  Sən sadəcə bu faylı redaktə et: ad, linklər, app-lər, şəkillər.
//  Kod fayllarına toxunmağa ehtiyac yoxdur.
// =============================================================

// -------------------- Types --------------------

export type AppProject = {
  id: string;
  name: string;
  /** Poster şəkli (1:2 nisbət, məs. 400×800). Faylı public/project/poster/
   *  qovluğuna at və buraya "/project/poster/<id>.png" yaz.
   *  Boş qalsa gradient placeholder çıxır. */
  poster?: string;
  /** Boş qalsa badge boz (not available) görünür. */
  appStoreUrl?: string;
  playStoreUrl?: string;
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

export type GalleryPhoto = {
  /** public/gallery/ içindəki şəkil — öz fotolarını atıb src-ləri dəyiş */
  src: string;
  location: string;
  subtitle?: string;
};

export type SocialKey = "instagram" | "x" | "linkedin" | "youtube" | "github";

// -------------------- Profil --------------------

export const profile = {
  name: "Elnur Qasimov",
  /** Hero-dakı böyük başlıq */
  role: "Senior Flutter Developer",
  /** Mavi əlyazma sətir */
  tagline: "20+ apps across iOS, Android & web",
  available: true,
  location: "Baku, Azerbaijan",
  email: "gasimovelnur2019@gmail.com",
  /** public/avatar.jpg qoyandan sonra "/avatar.jpg" yaz — boşdursa gradient dairə çıxır */
  avatar: "",
  /** public/resume.pdf qoyandan sonra "/resume.pdf" yaz — boşdursa CV sətri gizlənir */
  resumeUrl: "",
};

// -------------------- Sosial linklər --------------------
// Boş buraxdığın gizlənir (həm hero ikonları, həm contact siyahısı).

export const socials: Record<SocialKey, string> = {
  instagram: "",
  x: "",
  linkedin: "",
  youtube: "",
  github: "https://github.com/Qasimovv",
};

// -------------------- Contact kartı --------------------

export const contact = {
  heading: "let’s work together",
  /** bold: true olan hissələr qalın göstərilir */
  blurb: [
    { text: "I’ve built " },
    { text: "20+ Flutter apps & games", bold: true },
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
//  Store linklərini yapışdır — boş qalanlar boz badge ilə görünür.

export const apps: AppProject[] = [
  { id: "patches", name: "Patches", appStoreUrl: "", playStoreUrl: "" },
  { id: "mergio", name: "Mergio: 2048 Block Blast", appStoreUrl: "", playStoreUrl: "" },
  { id: "wend", name: "Wend", appStoreUrl: "", playStoreUrl: "" },
  { id: "tango", name: "Tango", appStoreUrl: "", playStoreUrl: "" },
  { id: "recur", name: "Recur", appStoreUrl: "", playStoreUrl: "" },
  { id: "admobpulse", name: "AdMob Pulse", appStoreUrl: "", playStoreUrl: "" },
  { id: "infopulse", name: "InfoPulse AI", appStoreUrl: "", playStoreUrl: "" },
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

// -------------------- Gallery (foto lenti) --------------------
//  Öz fotolarını public/gallery/ qovluğuna at və src-ləri dəyiş.
//  Klik instagram linkinə aparır (socials.instagram boşdursa klik olmur).

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
