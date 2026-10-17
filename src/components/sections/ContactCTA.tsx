import { Mail, MessageSquare, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function ContactCTA() {
  return (
    <Section id="contact" className="relative overflow-hidden bg-bg-soft">
      <div className="glow left-[10%] bottom-[-10%] size-[28rem] bg-brand-violet/20" aria-hidden />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <span className="eyebrow">Contact</span>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
              Have a project <span className="text-gradient">in mind?</span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Whether it&apos;s a quick question or a full build, I&apos;d love to hear about it. Book a
              project to open a chat with me, or drop a message and I&apos;ll reply by email.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex w-fit items-center gap-3 text-fg/90 transition-colors hover:text-fg"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-surface text-brand-blue ring-1 ring-line-strong">
                  <Icon icon={Mail} size={18} />
                </span>
                {site.email}
              </a>
              <div className="inline-flex w-fit items-center gap-3 text-muted">
                <span className="grid size-10 place-items-center rounded-xl bg-surface text-brand-violet ring-1 ring-line-strong">
                  <Icon icon={MapPin} size={18} />
                </span>
                Working with clients worldwide
              </div>
            </div>

            <div className="pt-2">
              <ButtonLink href="/book" size="lg" iconLeft={MessageSquare}>
                Book a project
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
