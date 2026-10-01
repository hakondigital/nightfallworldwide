// Solar position maths (NOAA general solar position equations) — used to
// count down to the real nightfall over Burleigh Heads. "Nightfall" is
// taken as the end of civil twilight (sun 6° below the horizon).

const RAD = Math.PI / 180;

function solarEventUTC(date: Date, lat: number, lon: number, zenith: number, rising: boolean): Date | null {
  // Day of year
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);

  const lngHour = lon / 15;
  const t = day + ((rising ? 6 : 18) - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 282.634;
  L = ((L % 360) + 360) % 360;

  let RA = Math.atan(0.91764 * Math.tan(L * RAD)) / RAD;
  RA = ((RA % 360) + 360) % 360;
  const Lq = Math.floor(L / 90) * 90;
  const RAq = Math.floor(RA / 90) * 90;
  RA = (RA + (Lq - RAq)) / 15;

  const sinDec = 0.39782 * Math.sin(L * RAD);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(zenith * RAD) - sinDec * Math.sin(lat * RAD)) / (cosDec * Math.cos(lat * RAD));
  if (cosH > 1 || cosH < -1) return null;

  let H = rising ? 360 - Math.acos(cosH) / RAD : Math.acos(cosH) / RAD;
  H /= 15;
  const T = H + RA - 0.06571 * t - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;

  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCMilliseconds(UT * 3600 * 1000);
  return d;
}

/** Local calendar date at the site (Brisbane has no DST: UTC+10). */
const siteDate = (now: Date, utcOffsetH: number) => new Date(now.getTime() + utcOffsetH * 3600 * 1000);

export type SunState = {
  now: Date;
  sunset: Date;
  nightfall: Date;
  sunrise: Date;
  isNight: boolean;
  /** next nightfall (today's if still ahead, else tomorrow's) */
  next: Date;
};

export function sunState(lat: number, lon: number, now = new Date(), utcOffsetH = 10): SunState {
  const local = siteDate(now, utcOffsetH);
  const at = (offsetDays: number) => {
    const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + offsetDays, 12));
    return {
      sunset: solarEventUTC(d, lat, lon, 90.833, false)!,
      nightfall: solarEventUTC(d, lat, lon, 96, false)!,
      sunrise: solarEventUTC(d, lat, lon, 96, true)!,
    };
  };

  // The equations return UTC times on the *UTC* date; for UTC+10 the evening
  // event falls on the same UTC date as local midday, so this is stable.
  const today = at(0);
  const tomorrow = at(1);
  const fixDay = (d: Date, ref: Date) => {
    // make sure the event sits within ±14h of the local noon reference
    const diff = d.getTime() - ref.getTime();
    if (diff > 14 * 3600e3) return new Date(d.getTime() - 86400e3);
    if (diff < -14 * 3600e3) return new Date(d.getTime() + 86400e3);
    return d;
  };
  const noon = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 12 - utcOffsetH));
  const sunset = fixDay(today.sunset, noon);
  const nightfall = fixDay(today.nightfall, noon);
  const sunrise = fixDay(today.sunrise, noon);
  const nightfallTomorrow = fixDay(tomorrow.nightfall, new Date(noon.getTime() + 86400e3));

  const isNight = now < sunrise || now >= nightfall;
  const next = now < nightfall ? nightfall : nightfallTomorrow;
  return { now, sunset, nightfall, sunrise, isNight, next };
}

export const fmtClock = (d: Date, tz = "Australia/Brisbane") =>
  new Intl.DateTimeFormat("en-AU", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(d);

export const fmtCountdown = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
