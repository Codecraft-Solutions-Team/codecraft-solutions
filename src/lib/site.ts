import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Gauge,
  ShieldCheck,
  LifeBuoy,
  Compass,
  FlaskConical,
  TrendingUp,
  Code2,
  Smartphone,
  RefreshCw,
} from "lucide-react";

/**
 * Single source of truth for brand copy, contact details and content.
 * PLACEHOLDERS: update `domain` and `email` with the real values when ready —
 * every page reads from here, so you only change them once.
 */
export const site = {
  name: "Codecraft Solutions",
  shortName: "Codecraft",
  tagline: "We code. We build. We deliver.",
  positioning: "Smarter. Cleaner. Built to scale.",
  intro:
    "I help businesses and entrepreneurs turn their ideas into powerful digital products — built on clean, scalable code that's made to last.",
  domain: "codecraftsol.org",
  email: "hello@codecraftsol.org",
  founder: "Sasen",
  social: {
    instagram: "https://instagram.com/",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export type NavLink = { label: string; href: string };

export const nav: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
};

export const services: Service[] = [
  {
    icon: AppWindow,
    title: "Custom Web & Mobile Apps",
    description:
      "Bespoke websites and applications built from the ground up — never templates, never bloat.",
    points: ["Clean, scalable code", "Responsive on every device", "Built to your exact spec"],
  },
  {
    icon: Gauge,
    title: "Fast & Reliable Solutions",
    description:
      "Performance and speed that actually matter — products that load instantly and stay stable under load.",
    points: ["Optimised for speed", "Rock-solid reliability", "Smooth, polished UX"],
  },
  {
    icon: ShieldCheck,
    title: "Secure & Scalable Systems",
    description:
      "Architecture built to grow with your business, with security considered at every layer.",
    points: ["Secure by design", "Scales as you grow", "Modern best practices"],
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    description:
      "I don't disappear at launch. Every build comes with real, hands-on aftercare.",
    points: ["1 month full support", "Up to 1 year bug-fix cover", "Direct line to me"],
  },
];

export type ProcessStep = {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    icon: Compass,
    step: "01",
    title: "Strong foundation",
    description:
      "We start with a focused MVP — the core of your idea, built right, so there's a solid base to grow on.",
  },
  {
    icon: FlaskConical,
    step: "02",
    title: "Test",
    description:
      "We put it in front of real use, refine the rough edges and make sure everything holds up before going wide.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Scale the right way",
    description:
      "Once it's proven, we grow deliberately — adding features and capacity without breaking what works.",
  },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

/**
 * PLACEHOLDER portfolio — swap these for real case studies + screenshots
 * when you're ready. The layout is built to take a project image per card.
 */
export const projects: Project[] = [
  {
    title: "Booking & client platform",
    category: "Web App",
    description:
      "A full booking flow with a private client area and live messaging — the kind of system this very site runs on.",
    icon: AppWindow,
    tags: ["Next.js", "Realtime", "Auth"],
  },
  {
    title: "Mobile-first storefront",
    category: "Mobile",
    description:
      "A fast, app-like storefront designed for phones first, with a checkout that converts.",
    icon: Smartphone,
    tags: ["React", "Payments", "PWA"],
  },
  {
    title: "Internal operations tool",
    category: "Software",
    description:
      "A custom dashboard that replaced spreadsheets and manual work with a single, reliable system.",
    icon: Code2,
    tags: ["Dashboard", "Automation", "API"],
  },
];

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "100%", label: "Custom-built code" },
  { value: "1 yr", label: "Bug-fix support" },
  { value: "MVP", label: "Foundation-first approach" },
  { value: "1:1", label: "Direct with the developer" },
];

export const valueProps: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Code2,
    title: "Clean code, not templates",
    body: "Every line is written for your project. No drag-and-drop bloat, no recycled themes.",
  },
  {
    icon: RefreshCw,
    title: "Built to scale",
    body: "Start lean, grow confidently. The foundation is laid so adding more never means starting over.",
  },
  {
    icon: LifeBuoy,
    title: "Real aftercare",
    body: "Launch is the start, not the end. You get genuine support long after going live.",
  },
];
