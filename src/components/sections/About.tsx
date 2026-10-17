import { site, valueProps } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { IconBadge } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <Section id="about">
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">About</span>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {`I'm ${site.founder} — and I build digital products that last`}
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed text-muted">
              <p>
                {`I'm the developer behind ${site.name}. I help businesses and entrepreneurs turn their ideas into powerful digital products — built on clean, scalable code, never templates or cut corners.`}
              </p>
              <p>
                My approach is simple: start with a strong foundation, test it properly, then scale
                the right way. You get software that does exactly what you need and grows with you.
              </p>
              <p>
                And I don&apos;t disappear at launch. Every project comes with real, hands-on support,
                so you&apos;re never left on your own once you&apos;re live.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-4">
            {valueProps.map((vp) => (
              <div key={vp.title} className="surface flex items-start gap-4 p-6">
                <IconBadge icon={vp.icon} size="md" />
                <div>
                  <h3 className="text-base font-semibold">{vp.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{vp.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
