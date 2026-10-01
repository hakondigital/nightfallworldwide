import type { CSSProperties } from "react";

// Surfaces that always look the same regardless of the page's day/night
// state (drawer = day, menu = night) pin their own palette locally.
export const dayVars = {
  "--bg": "#f3f3f0",
  "--fg": "#0a0a0a",
  "--muted": "rgb(10 10 10 / 0.56)",
  "--faint": "rgb(10 10 10 / 0.32)",
  "--line": "rgb(10 10 10 / 0.14)",
  "--panel": "#e9e9e5",
  colorScheme: "light",
} as CSSProperties;

export const nightVars = {
  "--bg": "#070707",
  "--fg": "#f3f3f0",
  "--muted": "rgb(243 243 240 / 0.56)",
  "--faint": "rgb(243 243 240 / 0.3)",
  "--line": "rgb(243 243 240 / 0.16)",
  "--panel": "#131313",
  colorScheme: "dark",
} as CSSProperties;
