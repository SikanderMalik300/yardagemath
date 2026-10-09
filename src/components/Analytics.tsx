import Script from "next/script";

/**
 * Analytics (build-spec A9, GA4 enabled). Loads only when NEXT_PUBLIC_GA_ID is set.
 *
 * Consent Mode v2: analytics/ad storage default to GRANTED everywhere EXCEPT the
 * EEA, UK and Switzerland, where they default to DENIED until the visitor accepts
 * (see ConsentBanner). Cloudflare Web Analytics is auto-injected by Cloudflare
 * Pages, so there is no beacon script here.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted'
          });
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','CH','IS','LI','NO'],
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
    </>
  );
}
