import type { Metadata } from "next";
import FormStepper from "@/components/forms/FormStepper";
import PageHero, { Rule, Spec } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { pitchingForm } from "@/lib/content/forms";
import { distribution } from "@/lib/content/services";
import { site } from "@/lib/content/site";
import { endpoints } from "@/lib/submit";

export const metadata: Metadata = {
  title: "Playlist pitching",
  description: "Everything we need to pitch your release to Spotify and other streaming platforms' editorial curators.",
  alternates: { canonical: "/distribution/pitching" },
};

export default function PitchingPage() {
  return (
    <>
      <PageHero
        code="01.3"
        kicker="Distribution — Pitching"
        meta="Spotify & DSP editorial"
        title="Playlist pitching"
        lede="This form gives us everything we need to pitch your release to Spotify and other streaming platforms."
        aside={
          <Spec
            rows={[
              { k: "Lead time", v: "At least 6 weeks before release" },
              { k: "Placement", v: distribution.pitchDisclaimer },
              { k: "Help", v: <a className="u-draw" href={`mailto:${site.email.studio}`}>{site.email.studio}</a> },
            ]}
          />
        }
      />
      <Section theme="day" className="pad-x pb-[clamp(60px,8vw,110px)]">
        <Rule left="Pitch form" right="Five short steps" className="mb-8" />
        <FormStepper def={pitchingForm} endpoint={endpoints.pitching} />
      </Section>
    </>
  );
}
