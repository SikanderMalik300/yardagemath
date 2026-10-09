import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How YardageMath handles data: analytics, the contact form, cookies, advertising, your rights under GDPR and CCPA, and how to contact us.",
  path: "/privacy-policy/",
});

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" updated="2026-10-09">
      <p>
        This Privacy Policy explains what information {SITE.name} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects when you visit {SITE.domain}, and how we use it. We aim to
        collect as little as possible.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Google Analytics.</strong> We use Google Analytics 4 to understand which
          calculators people use and how the site performs. It collects information such as pages
          viewed, device type, approximate location (country/city) and how you interact with the
          tools. Google Analytics uses cookies. Visitors in the EEA, UK and Switzerland are asked for
          consent first, and analytics cookies stay off until you agree. You can opt out of Google
          Analytics on all sites with Google&apos;s{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">opt-out browser add-on</a>.
          We keep analytics data for 14 months.
        </li>
        <li>
          <strong>Analytics (Cloudflare Web Analytics).</strong> We use{" "}
          <a href="https://www.cloudflare.com/web-analytics/" target="_blank" rel="noopener">Cloudflare Web Analytics</a>,
          which is privacy-first and cookieless. It does not use client-side state such as cookies
          or localStorage to track you, and it reports aggregated data only: page views, approximate
          region, referrer and device type. It does not fingerprint individuals.
        </li>
        <li>
          <strong>Contact form (Web3Forms).</strong> If you message us, the name, email and message
          you submit are processed by{" "}
          <a href="https://web3forms.com/" target="_blank" rel="noopener">Web3Forms</a> to deliver
          your message to us by email. We use it only to read and reply to your message.
        </li>
        <li>
          <strong>Calculator inputs stay in your browser.</strong> The calculations run entirely on
          your device. We do not send or store the numbers you type, except any you choose to
          include in a &ldquo;share link&rdquo; you copy.
        </li>
      </ul>

      <h2>Cookies and similar technologies</h2>
      <p>
        Google Analytics sets cookies; in the EEA, UK and Switzerland they stay off until you accept.
        Cloudflare Web Analytics is cookieless. Advertising cookies may be set once ads are enabled
        (see below). You can block or delete cookies in your browser settings.
      </p>

      <h2>Advertising</h2>
      <p>
        We plan to show ads through Google AdSense. When ads are enabled: third-party vendors,
        including Google, use cookies to serve ads based on your prior visits to this and other
        websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads
        based on your visits here and elsewhere. You can opt out of personalized advertising through{" "}
        <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Google Ads Settings</a>, or
        opt out of some third-party vendors at{" "}
        <a href="https://www.aboutads.info" rel="nofollow noopener" target="_blank">aboutads.info</a> (and{" "}
        <a href="https://www.youronlinechoices.eu" rel="nofollow noopener" target="_blank">youronlinechoices.eu</a> in
        the EU).
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some outbound links may be affiliate links, which can set cookies from the destination
        (such as Amazon Associates). See our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
      </p>

      <h2>Your rights</h2>
      <p>
        <strong>EU/UK (GDPR/UK GDPR):</strong> you have the right to access, correct, delete or
        restrict processing of your personal data, and to object to it. Where personalized ads are
        served in the EEA, UK or Switzerland, consent is requested through a Google-certified
        consent message.
      </p>
      <p>
        <strong>California (CCPA/CPRA):</strong> you have the right to know what personal
        information is collected and to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo;
        of personal information for targeted advertising. To exercise any right, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>Children</h2>
      <p>
        This site is not directed to children under 13, and we do not knowingly collect personal
        information from them (COPPA).
      </p>

      <h2>Changes &amp; contact</h2>
      <p>
        We may update this policy; the &ldquo;last updated&rdquo; date above reflects the latest
        version. Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ContentPage>
  );
}
