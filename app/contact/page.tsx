import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_WHATSAPP_URL,
} from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "Contact Us | Modern Homes",
  description:
    "Contact Modern Homes for premium sanitary ware, wholesale pricing, and project enquiries.",
  openGraph: {
    title: "Contact Us | Modern Homes",
    description:
      "Reach Modern Homes by phone, WhatsApp, email, or contact form.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-primary md:text-6xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          Tell us what you need, and our team will help with products, pricing,
          and availability.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-border bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-display text-3xl text-primary">Get in Touch</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        <aside className="rounded-lg border border-border bg-surface-2 p-6 md:p-8">
          <h2 className="font-display text-3xl text-primary">
            Contact Details
          </h2>
          <div className="mt-6 space-y-5 text-sm text-text-muted">
            <a
              href={BUSINESS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-accent" />
              <a href={BUSINESS_PHONE_TEL}>
                {BUSINESS_PHONE_DISPLAY || "Contact us"}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-accent" />
              <a href="mailto:info@modernhomes.in">info@modernhomes.in</a>
            </p>
            <p className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-accent" />
              <span>Premium sanitary ware showroom, India</span>
            </p>
            <div>
              <h3 className="font-semibold text-primary">Business Hours</h3>
              <p className="mt-2">Mon-Sat: 10:00 AM - 7:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        <iframe
          title="Modern Homes location map"
          src="https://www.google.com/maps?q=28.584366,77.369697&z=16&output=embed"
          className="h-[400px] w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
