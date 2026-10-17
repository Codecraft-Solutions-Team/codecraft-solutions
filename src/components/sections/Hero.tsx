import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { site, stats } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Backdrop */}
      <div className="grid-bg absolute inset-0" aria-hidden />
      <div
        className="glow left-[-10%] top-[-6%] size-[34rem] bg-brand-blue/30"
        aria-hidden
      />
      <div
        className="glow right-[-12%] top-[10%] size-[32rem] bg-brand-purple/25"
        aria-hidden
      />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <span className="grid size-16 place-items-center rounded-2xl bg-bg ring-1 ring-line-strong shadow-[0_0_60px_-12px_#5b6bff66]">
              <Logo variant="mark" height={34} href={null} priority />
            </span>
          </Reveal>

          <Reveal delay={80} className="mt-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-muted ring-1 ring-line-strong">
              <Icon icon={Sparkles} size={14} className="text-brand-blue" />
              Custom web &amp; app development
            </span>
          </Reveal>

          <Reveal delay={140} as="h1" className="mt-6 text-5xl font-semibold sm:text-6xl md:text-7xl">
            <span className="block">Smarter. Cleaner.</span>
            <span className="block text-gradient">Built to scale.</span>
          </Reveal>

          <Reveal delay={220} as="p" className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {site.intro}
          </Reveal>

          <Reveal delay={300} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <ButtonLink href="/book" size="lg" iconLeft={MessageSquare}>
              Book a project
            </ButtonLink>
            <ButtonLink href="/#work" size="lg" variant="secondary" iconRight={ArrowRight}>
              See the work
            </ButtonLink>
          </Reveal>
        </div>

        {/* Trust bar */}
        <Reveal
          delay={380}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-bg-soft px-6 py-7 text-center">
              <div className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
