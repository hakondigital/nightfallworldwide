import type { Metadata } from "next";
import FormStepper from "@/components/forms/FormStepper";
import PageHero, { Rule } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { uploadForm } from "@/lib/content/forms";
import { fileSpecs } from "@/lib/content/services";
import { site } from "@/lib/content/site";

// Unlisted — same URL as the old site. Nightfall sends artists this link once
// they're on the label; it isn't in the nav, the sitemap or search results.
export const metadata: Metadata = {
  title: "Upload a release",
  description: "Submit your release to Nightfall Distribution — title, credits, splits and release date.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/uploadform" },
};

export default function UploadPage() {
  return (
    <>
      <PageHero
        code="01.3"
        kicker="Distribution — Release form"
        meta="Nightfall Distribution"
        title="Upload a release"
        lede={
          <>
            Send us your release details. Email your <strong className="font-semibold text-fg">master</strong> and{" "}
            <strong className="font-semibold text-fg">artwork</strong> to {site.email.distribution}, exported to the specs on the right.
          </>
        }
        aside={
          <div className="grid grid-cols-2 gap-6 border-t border-line pt-4">
            {[
              { t: "Audio", items: fileSpecs.audio.slice(0, 3) },
              { t: "Artwork", items: fileSpecs.artwork.slice(1, 4) },
            ].map((g) => (
              <div key={g.t}>
                <p className="t-label mb-2 text-muted">{g.t}</p>
                <ul className="flex flex-col gap-1.5">
                  {g.items.map((i) => (
                    <li key={i} className="t-body text-[0.92rem] leading-snug">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        }
      />
      <Section theme="day" className="pad-x pb-[clamp(60px,8vw,110px)]">
        <Rule left="Release form" right="About 5 minutes" className="mb-8" />
        <FormStepper def={uploadForm} />
        <p className="t-label mt-10 text-muted">Trouble with the form? Email {site.email.studio}.</p>
      </Section>
    </>
  );
}
