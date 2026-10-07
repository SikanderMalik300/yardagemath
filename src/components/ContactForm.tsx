"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";
import { Field } from "@/components/calculator/Fields";

/**
 * Static-site contact form via Web3Forms (build-spec A7 "Contact").
 * Honeypot spam field, no CAPTCHA wall. Set NEXT_PUBLIC_WEB3FORMS_KEY to enable;
 * otherwise the email fallback is shown.
 */
export function ContactForm() {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!accessKey) {
    return (
      <p className="notice">
        The contact form is being set up. In the meantime, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and I&apos;ll reply within 2–3 business days.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="notice" style={{ borderColor: "#cfe1d6", background: "var(--brand-soft)", color: "var(--success)" }}>
        Thanks — your message was sent. I&apos;ll reply within 2–3 business days.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value="YardageMath contact form" />
      {/* Honeypot — bots fill this; humans never see it */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px" }}
        aria-hidden="true"
      />

      <Field label="Your name" htmlFor="name">
        <input id="name" name="name" className="input" type="text" required autoComplete="name" />
      </Field>
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" className="input" type="email" required autoComplete="email" />
      </Field>
      <Field label="Message" htmlFor="message">
        <textarea id="message" name="message" className="input" required rows={5} style={{ minHeight: 120, resize: "vertical" }} />
      </Field>
      <button type="submit" className="button-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="field-error" role="alert" style={{ marginTop: "0.5rem" }}>
          Something went wrong. Please email {SITE.email} instead.
        </p>
      )}
    </form>
  );
}
