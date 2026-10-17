import { Check } from "lucide-react";
import { services } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { IconBadge, Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Services() {
  return (
    <Section id="services" className="bg-bg-soft">
      <Container>
        <SectionHeading
          eyebrow="What I offer"
          title={<>Everything you need, built properly</>}
          lead="No templates, no shortcuts. Just clean, custom software designed around your goals — and supported long after launch."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 90}>
              <article className="surface group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                <IconBadge icon={service.icon} size="md" />
                <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm text-fg">
                      <span className="grid size-5 place-items-center rounded-full bg-brand-blue/15 text-brand-blue">
                        <Icon icon={Check} size={13} strokeWidth={2.5} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
