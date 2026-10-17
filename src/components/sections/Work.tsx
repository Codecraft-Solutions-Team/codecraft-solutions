import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Work() {
  return (
    <Section id="work" className="bg-bg-soft">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Built, shipped, supported"
          lead="A look at the kind of products I build. Real case studies and screenshots are on the way — these show the range."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 90}>
              <article className="surface group flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1">
                {/* Visual placeholder — swap for a real screenshot per project */}
                <div className="relative grid h-44 place-items-center overflow-hidden border-b border-line bg-[radial-gradient(120%_120%_at_30%_0%,#2f93ff22,transparent_60%),radial-gradient(120%_120%_at_80%_100%,#8a3ff026,transparent_55%)]">
                  <div className="grid size-16 place-items-center rounded-2xl bg-bg/60 ring-1 ring-line-strong backdrop-blur">
                    <Icon icon={project.icon} size={28} className="text-brand-blue" />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-bg/70 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest text-muted ring-1 ring-line">
                    {project.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <Icon
                      icon={ArrowUpRight}
                      size={18}
                      className="mt-1 text-faint transition-colors group-hover:text-brand-blue"
                    />
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted ring-1 ring-line"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
