import { HONEYPOT } from "@/lib/content/forms";

/**
 * A text field no person ever sees or tabs to. Spam bots fill in every input
 * they find, so a value here marks the submission as junk and the API route
 * quietly drops it. Pass `value`/`onChange` to drive it from React state;
 * leave them off inside a plain <form> and read it from FormData.
 */
export default function Honeypot({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" value={value} onChange={onChange && ((e) => onChange(e.target.value))} />
      </label>
    </div>
  );
}
