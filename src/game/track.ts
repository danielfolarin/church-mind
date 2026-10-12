/**
 * Anonymous counting of what gets played (Umami, loaded in index.html).
 * Never send anything a player typed: no names, no prayers, no child or pet names.
 * Off the live site, or with a blocker on, there is no `umami` and this does nothing.
 */
type Detail = Record<string, string | number | boolean>;

export function track(event: string, detail?: Detail) {
  try {
    (window as unknown as { umami?: { track: (event: string, detail?: Detail) => void } }).umami?.track(event, detail);
  } catch {
    // Counting must never get in the way of playing.
  }
}
