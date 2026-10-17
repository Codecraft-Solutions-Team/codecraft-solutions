import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Work />
      <About />
      <ContactCTA />
    </>
  );
}
