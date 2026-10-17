import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { site, nav } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

const socials = [
  { Icon: InstagramIcon, href: site.social.instagram, label: "Instagram" },
  { Icon: GithubIcon, href: site.social.github, label: "GitHub" },
  { Icon: LinkedinIcon, href: site.social.linkedin, label: "LinkedIn" },
];

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="relative border-t border-line bg-bg-soft">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo height={36} />
            <p className="max-w-xs text-sm leading-relaxed text-muted">{site.intro}</p>
            <div className="flex items-center gap-2">
              {socials.map(({ Icon: Glyph, ...s }) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full text-muted ring-1 ring-line-strong transition-colors hover:text-fg hover:ring-brand-blue/60"
                >
                  <Glyph size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer">
            <p className="eyebrow mb-1">Explore</p>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="eyebrow mb-1">Get in touch</p>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <Icon icon={Mail} size={18} />
              {site.email}
            </a>
            <Link
              href="/book"
              className="group inline-flex w-fit items-center gap-1.5 text-sm text-brand-blue transition-colors hover:text-brand-violet"
            >
              Start a project
              <Icon icon={ArrowUpRight} size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-sm text-faint sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs tracking-wide">{site.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
