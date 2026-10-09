"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/** External link that fires a GA4 `outbound_click` event (host only, no personal data). */
export function OutboundLink({
  href,
  children,
  style,
}: {
  href: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  let host = "";
  try {
    host = new URL(href).host;
  } catch {
    host = href;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      style={style}
      onClick={() => trackEvent("outbound_click", { link_domain: host })}
    >
      {children}
    </a>
  );
}
