import { Archivo, Fragment_Mono } from "next/font/google";
import localFont from "next/font/local";

// Body copy.
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Every title — the logo's Helvetica Bold. Self-hosted (a TeX Gyre Heros
// subset, see _fonts/README) so Windows doesn't swap in Arial.
export const display = localFont({
  src: "./_fonts/nightfall-display-bold.woff2",
  weight: "700",
  variable: "--font-helvetica",
  display: "swap",
});

// Helvetica, as a monospace — for small labels and data.
export const fragment = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});
