"use client";

import { useBooking } from "@/components/booking/Booking";
import { useLenis } from "@/components/providers/SmoothScroll";
import { TLink } from "@/components/providers/Transition";
import { Arrow, InstagramGlyph } from "@/components/ui/Icons";
import NightfallClock from "@/components/ui/NightfallClock";
import Section from "@/components/ui/Section";
import { musicNav, site } from "@/lib/content/site";

function Col({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {href ? (
        <TLink href={href} className="t-wide-s u-draw mb-2 self-start">
          {title}
        </TLink>
      ) : (
        <span className="t-wide-s mb-2">{title}</span>
      )}
      {children}
    </div>
  );
}

const link = "t-body u-draw self-start text-muted transition-colors hover:text-fg";

export default function Footer() {
  const booking = useBooking();
  const lenis = useLenis();

  return (
    <Section as="footer" theme="night" line={70} className="pt-[clamp(64px,8vw,110px)]">
      <div className="pad-x grid-12 gap-y-12">
        <div className="col-span-12 flex flex-col gap-5 lg:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/nightfall-badge-white.png" alt="Nightfall Worldwide — Nightfall will always come again" width={720} height={144} className="h-auto w-[min(300px,80%)]" />
          <p className="t-body max-w-[34ch] text-muted">{site.description}</p>
          <NightfallClock className="text-muted" />
        </div>

        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <Col title="Music" href="/music">
            {musicNav.map((n) => (
              <TLink key={n.href} href={n.href} className={link}>
                {n.label}
                {n.external ? " ↗" : ""}
              </TLink>
            ))}
          </Col>
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <Col title="Advertising & Film" href="/advertising-film">
            <button onClick={() => booking.open("enquire", { topic: "Film / TV scoring" })} className={link}>
              Enquire now
            </button>
            <TLink href="/advertising-film#services" className={link}>
              Film scoring
            </TLink>
            <TLink href="/advertising-film#work" className={link}>
              Selected work
            </TLink>
          </Col>
        </div>
        <div className="col-span-6 md:col-span-3 lg:col-span-2">
          <Col title="WhiteWall" href="/whitewall">
            <button onClick={() => booking.open("whitewall")} className={link}>
              Book now
            </button>
            <TLink href="/whitewall#packages" className={link}>
              Packages
            </TLink>
            <TLink href="/whitewall#location" className={link}>
              Location
            </TLink>
          </Col>
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <Col title="Contact" href="/contact">
            <a href={`mailto:${site.email.admin}`} className={link}>
              {/* narrow columns wrap after the @, never mid-word */}
              {site.email.admin.split("@")[0]}@<wbr />
              {site.email.admin.split("@")[1]}
            </a>
            <a href={site.links.maps} target="_blank" rel="noreferrer" className={link}>
              {site.address.street}, {site.address.suburb}
            </a>
            <a href={site.links.instagram} target="_blank" rel="noreferrer" className={`${link} flex items-center gap-2`}>
              <InstagramGlyph /> Instagram
            </a>
            <a href={site.links.distroPortal} target="_blank" rel="noreferrer" className={link}>
              Artist login ↗
            </a>
          </Col>
        </div>
      </div>

      <div className="pad-x mt-[clamp(48px,6vw,90px)] flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
        <span className="t-label text-muted">
          © {new Date().getFullYear()} {site.name} — Burleigh Heads, Gold Coast, Australia
        </span>
        <button onClick={() => lenis?.scrollTo(0, { duration: 1.6 })} className="t-label u-draw flex items-center gap-2 self-start md:self-auto">
          Back to top <Arrow dir="n" />
        </button>
      </div>
    </Section>
  );
}
