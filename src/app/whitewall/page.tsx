import type { Metadata } from "next";
import PackageGrid from "@/components/booking/PackageGrid";
import BookButton from "@/components/ui/BookButton";
import Media from "@/components/ui/Media";
import PageHero, { HeroAction, Rule, Spec } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { whitewall, whitewallPackages } from "@/lib/content/services";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "WhiteWall — the Gold Coast's tallest whitewall",
  description:
    "Hire the WhiteWall by Nightfall at 3/1 Rothcote Court, Burleigh Heads — a 5.5 m × 7.2 m cyclorama with natural light and a green room. From $100 per hour; 2-hour, half-day, full-day and 12-hour packages.",
  alternates: { canonical: "/whitewall" },
};

const ADDR = site.whitewallAddress;
const MAP = `https://www.google.com/maps?q=${encodeURIComponent(`${ADDR.street}, ${ADDR.suburb} ${ADDR.state} ${ADDR.postcode}`)}&output=embed`;

const GALLERY = ["ww-cap", "ww-denim", "ww-tank", "ww-phone", "ww-records", "ww-ball-chair"] as const;

export default function WhiteWallPage() {
  return (
    <>
      <PageHero
        code="03"
        kicker="WhiteWall® — by Nightfall Studio"
        meta="Photo · Video · Content"
        title="WhiteWall"
        lede={whitewall.lede}
        aside={
          <HeroAction label="From" value="$100 per hour" note="Packages from 2 hours to a full 12-hour day">
            <BookButton tab="whitewall">Book now</BookButton>
          </HeroAction>
        }
      />

      <Section theme="day" className="pad-x">
        <Media name="ww-armchair" alt="An armchair and guitar on the WhiteWall's curved cyclorama" sizes="100vw" className="aspect-[4/3] w-full sm:aspect-[21/9]" position="50% 62%" priority />
      </Section>

      <Section theme="day" id="packages" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Packages" right="Live availability — pick a package" />
        <div className="mt-6">
          <PackageGrid packages={whitewallPackages} tab="whitewall" />
        </div>
      </Section>

      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <Rule left="The space" />
            <ul className="mt-2">
              {whitewall.features.map((f) => (
                <li key={f} className="t-body flex items-baseline gap-3 border-b border-line py-3">
                  <span className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 bg-rec" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <Rule left="Lighting package" right="Add to any booking" />
            <ul className="mt-2">
              {whitewall.lighting.rates.map((r) => (
                <li key={r.label} className="flex items-baseline justify-between border-b border-line py-3">
                  <span className="t-body">{r.label}</span>
                  <span className="t-price text-[1.4rem]">{r.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {whitewall.lighting.groups.map((g) => (
                <div key={g.group}>
                  <p className="t-label mb-2 text-muted">{g.group}</p>
                  <ul className="flex flex-col gap-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="t-body text-[0.92rem] leading-snug">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="Shot on the wall" />
        <div className="mt-6 grid grid-cols-2 gap-(--gap) sm:grid-cols-3 lg:grid-cols-6">
          {GALLERY.map((n) => (
            <Media key={n} name={n} alt="Shot on the Nightfall WhiteWall" sizes="(min-width: 1024px) 16vw, (min-width: 640px) 32vw, 50vw" className="aspect-[3/4] w-full" />
          ))}
        </div>
      </Section>

      <Section theme="day" id="location" className="pad-x scroll-mt-32 py-[clamp(60px,8vw,110px)]">
        <Rule left="Location" right={site.geo.label} />
        <div className="grid-12 mt-6 gap-y-8">
          <div className="col-span-12 flex flex-col gap-5 md:col-span-4">
            <h2 className="t-l">Find us</h2>
            <Spec
              rows={[
                { k: "Address", v: `${ADDR.street}, ${ADDR.suburb} ${ADDR.postcode}` },
                { k: "Parking", v: "On-site parking available" },
                { k: "Directions", v: <a className="u-draw" href={site.links.whitewallMaps} target="_blank" rel="noreferrer">Open in Google Maps ↗</a> },
                { k: "Instagram", v: <a className="u-draw" href={site.links.whitewallInstagram} target="_blank" rel="noreferrer">{site.links.whitewallInstagramHandle} ↗</a> },
              ]}
            />
            <BookButton tab="whitewall">Book now</BookButton>
          </div>
          <div className="col-span-12 aspect-[4/3] overflow-hidden border border-line md:col-span-8 md:aspect-[16/9]">
            <iframe src={MAP} title="Map — 3/1 Rothcote Court, Burleigh Heads" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full [filter:grayscale(1)_contrast(1.08)]" />
          </div>
        </div>
      </Section>
    </>
  );
}
