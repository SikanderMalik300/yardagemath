import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with YardageMath. Send a question, suggestion or correction, or email us directly. We reply within 2–3 business days.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      intro="Questions, suggestions or corrections are welcome. Use the form below or email directly — I reply within 2–3 business days."
    >
      <p>
        Prefer email? Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. There&apos;s no
        street address — YardageMath is an online tool, not a local business.
      </p>
      <ContactForm />
    </ContentPage>
  );
}
