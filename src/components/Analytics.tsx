import Script from "next/script";

/**
 * Analytics (build-spec A9). Nothing loads unless the env vars are set, so the
 * default build ships no third-party scripts.
 *
 * - GA4 via next/script afterInteractive, with Consent Mode v2 denied-by-default
 *   for EEA/UK/CH visitors (granted elsewhere) until a CMP updates consent.
 * - Cloudflare Web Analytics (cookieless) as a deferred beacon.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const cfToken = process.env.NEXT_PUBLIC_CF_BEACON;

  return (
    <>
      {gaId && (
        <>
          <Script id="ga-consent-default" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','CH','IS','LI','NO'],
                wait_for_update: 500
              });
              gtag('consent', 'default', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {cfToken && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${cfToken}"}`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
