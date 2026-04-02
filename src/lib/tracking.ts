/**
 * Lightweight tracking utility.
 *
 * Pushes structured events to the GTM dataLayer and fires Meta Pixel events.
 * No external dependencies. Safe for SSR — all calls guard typeof window.
 *
 * Usage:
 *   trackCTAClick("engagement")
 *   trackLeadIntent("contact-form")
 *   trackEvent("SCROLL_DEPTH", { percent: 50 })
 */

function push(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/** Generic structured event — use for custom signals */
export function trackEvent(name: string, payload: Record<string, unknown> = {}): void {
  push({ event: name, page: "home", ...payload });
}

/**
 * CTA click intent.
 * Fires on every visible CTA interaction across the landing.
 *
 * @param section  e.g. "capabilities" | "engagement" | "disqualification"
 */
export function trackCTAClick(section: string): void {
  push({ event: "CTA_CLICK", section, page: "home" });

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: section });
  }
}

/**
 * High-intent lead signal — fired on form submit or equivalent action.
 *
 * @param source  e.g. "contact-form" | "pricing-anchor"
 */
export function trackLeadIntent(source: string): void {
  push({ event: "LEAD_INTENT", source, page: "home" });

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: source });
  }
}
