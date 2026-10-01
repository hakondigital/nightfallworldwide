import { TLink } from "@/components/providers/Transition";
import Globe from "@/components/ui/Globe";
import { Arrow } from "@/components/ui/Icons";
import NightfallClock from "@/components/ui/NightfallClock";
import Section from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section theme="night" className="pad-x flex min-h-svh flex-col justify-center gap-10 pt-(--header-h)">
      <div className="relative grid place-items-center">
        <div className="absolute aspect-square w-[min(70vmin,560px)] opacity-40">
          <Globe radius={0.46} speed={40} />
        </div>
        <p className="t-xl relative text-[clamp(6rem,22vw,16rem)] leading-none">404</p>
      </div>
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="t-l">Lost after dark</p>
        <p className="t-body max-w-[40ch] text-muted">This page doesn&apos;t exist — or it moved when the site was rebuilt. Head back to the start.</p>
        <TLink href="/" className="group t-wide-s flex items-center gap-3 bg-paper px-5 py-4 text-ink">
          Back to the start <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
        </TLink>
        <NightfallClock className="justify-center text-muted" />
      </div>
    </Section>
  );
}
