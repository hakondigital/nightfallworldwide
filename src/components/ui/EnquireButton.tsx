"use client";

import BookButton from "@/components/ui/BookButton";

/** Opens the enquiry drawer pre-set to a topic. */
export default function EnquireButton({
  topic,
  children,
  className,
  variant = "solid",
}: {
  topic?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "line" | "paper";
}) {
  return (
    <BookButton tab="enquire" opts={{ topic }} variant={variant} className={className}>
      {children}
    </BookButton>
  );
}
