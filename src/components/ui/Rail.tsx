import { Stagger } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const COLS = {
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
  8: "lg:grid-cols-8",
} as const;

/** Cards as a swipeable rail on phones and tablets, an even grid from laptop up. */
export default function Rail({ children, cols, className }: { children: React.ReactNode; cols: keyof typeof COLS; className?: string }) {
  return (
    <Stagger
      className={cn(
        "-mx-(--pad) flex snap-x snap-mandatory scroll-px-(--pad) gap-(--gap) overflow-x-auto overscroll-x-contain px-(--pad) [scrollbar-width:none]",
        "*:w-[40vw] *:max-w-[230px] *:shrink-0 *:snap-start",
        "lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:*:w-auto lg:*:max-w-none",
        COLS[cols],
        className,
      )}
    >
      {children}
    </Stagger>
  );
}
