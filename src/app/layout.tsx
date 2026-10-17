import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { AuthProvider } from "@/lib/data/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — ${site.positioning}`,
    template: `%s · ${site.name}`,
  },
  description: site.intro,
  applicationName: site.name,
  keywords: [
    "web development",
    "mobile app development",
    "custom software",
    "Next.js",
    site.name,
  ],
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.positioning}`,
    description: site.intro,
    siteName: site.name,
    url: `https://${site.domain}`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.positioning}`,
    description: site.intro,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-dvh bg-bg text-fg">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
