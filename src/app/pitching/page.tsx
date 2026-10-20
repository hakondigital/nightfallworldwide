import type { Metadata } from "next";
import FormStepper from "@/components/forms/FormStepper";
import PageHero, { Rule, Spec } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { pitchingForm } from "@/lib/content/forms";
import { distribution } from "@/lib/content/services";
import { site } from "@/lib/content/site";

// Unlisted — same URL as the old site. Nightfall sends artists this link once
// they're on the label; it isn't in the nav, the sitemap or search results.
export const metadata: Metadata = {
  title: "Playlist pitching",
  description: "Everything Nightfall needs to pitch your release to Spotify and the other streaming platforms.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pitching" },
};

export default function PitchingPage() {
  return (
    <>
      <PageHero
        code="01.3"
        kicker="Distribution — Playlist pitching"
        meta="Nightfall Distribution"
        title="Playlist pitching"
        lede={
          <>
            This gives us everything we need to pitch your release to Spotify and the other streaming platforms. Allow at least{" "}
            <strong className="font-semibold text-fg">six weeks</strong> before the release date, and make sure your master and artwork are with {site.email.distribution}.
          </>
        }
        aside={
          <div className="flex flex-col gap-5">
            <Spec
              rows={[
                { k: "Lead time", v: "Six weeks before release" },
                { k: "Takes", v: "About 10 minutes" },
                { k: "Masters & artwork", v: site.email.distribution },
              ]}
            />
            <p className="t-body text-[0.92rem] leading-snug text-muted">{distribution.pitchDisclaimer}</p>
          </div>
        }
      />
      <Section theme="day" className="pad-x pb-[clamp(60px,8vw,110px)]">
        <Rule left="Pitching form" right="About 10 minutes" className="mb-8" />
        <FormStepper def={pitchingForm} />
        <p className="t-label mt-10 text-muted">Trouble with the form? Email {site.email.studio}.</p>
      </Section>
    </>
  );
}
