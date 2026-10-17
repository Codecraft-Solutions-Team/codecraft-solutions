import { process } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { IconBadge } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <Section id="process">
      <Container>
        <SectionHeading
          eyebrow="How I work"
          title="A clear path from idea to scale"
          lead="Every project follows the same proven rhythm — so you always know where things stand and what comes next."
        />

        <div className="relative mt-16">
          {/* Connecting line on desktop */}
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
            aria-hidden
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {process.map((stepItem, i) => (
              <Reveal key={stepItem.step} delay={i * 110} className="relative flex flex-col items-start">
                <div className="flex items-center gap-4">
                  <span className="relative z-10 bg-bg pr-1">
                    <IconBadge icon={stepItem.icon} size="md" />
                  </span>
                  <span className="font-mono text-sm tracking-widest text-faint">{stepItem.step}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{stepItem.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                  {stepItem.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
