"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

/**
 * Marketing contact form. No server route yet — we open the visitor's
 * default mail client via a `mailto:` URL so submissions land in
 * Justin's inbox with Dustin CC'd. Plain text body, fields stitched
 * together with line breaks. Swap for an API route + transactional
 * email service (Resend / Postmark) when we want analytics or
 * server-side capture.
 */
const TO = "jmiller@qbelite.com";
const CC = "dustin@qbelite.com";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string | null)?.trim() ?? "";
    const email = (data.get("email") as string | null)?.trim() ?? "";
    const athleteClass =
      (data.get("athlete_class") as string | null)?.trim() ?? "";
    const message = (data.get("message") as string | null)?.trim() ?? "";

    const subject = `QB Elite Inquiry — ${name || "New message"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Athlete Class: ${athleteClass}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailto =
      `mailto:${TO}` +
      `?cc=${encodeURIComponent(CC)}` +
      `&subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    // Re-enable the button after the mail client has had a moment
    // to take over so the visitor can retry if they cancelled.
    setTimeout(() => setSubmitting(false), 1500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
    >
      <FormField name="name" label="Name" placeholder="Full name" required />
      <FormField
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <FormField
        name="athlete_class"
        label="Athlete Class"
        placeholder="e.g. 2027"
      />
      <label className="mt-1 flex flex-col gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">
          Message
        </span>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Tell us a bit about your goals..."
          className="border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/35 outline-none ring-primary/50 focus:ring-2"
        />
      </label>
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="mt-2 h-14 rounded-none bg-primary text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.45)] hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Opening Mail App…" : "Send Message"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
        Or email{" "}
        <a
          href={`mailto:${TO}?cc=${encodeURIComponent(CC)}`}
          className="text-primary hover:underline"
        >
          {TO}
        </a>
      </p>
    </form>
  );
}

function FormField({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-11 border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/35 outline-none ring-primary/50 focus:ring-2"
      />
    </label>
  );
}
