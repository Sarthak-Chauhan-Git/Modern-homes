import type { Metadata } from "next";
import { Building2, Headphones, MessageCircle, ShoppingCart, Truck, Wrench } from "lucide-react";
import { BUSINESS_WHATSAPP_URL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "Our Services | Modern Homes",
  description: "Retail, wholesale, project procurement, expert guidance, and after-sales support from Modern Homes.",
  openGraph: {
    title: "Our Services | Modern Homes",
    description: "Sanitary ware supply and support for homes, traders, and projects.",
    type: "website",
  },
};

const services = [
  { title: "Retail Supply", text: "Individual purchases with no minimum quantity. Walk in or order online.", icon: ShoppingCart },
  { title: "Wholesale Supply", text: "Bulk orders for traders and businesses at the best trade prices.", icon: Truck },
  { title: "Project Procurement", text: "End-to-end supply for builders, contractors, and developers.", icon: Building2 },
  { title: "Expert Guidance", text: "Our team helps you select the right products for your space and budget.", icon: MessageCircle },
  { title: "Installation Advice", text: "Technical support and guidance from our experienced team.", icon: Wrench },
  { title: "After-Sales Support", text: "Warranty assistance and support after your purchase.", icon: Headphones },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-primary md:text-6xl">Our Services</h1>
        <p className="mt-4 max-w-2xl text-text-muted">Support for retail buyers, trade customers, and full-scale projects.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="rounded-lg border border-border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 inline-flex rounded-full bg-accent/15 p-4 text-accent">
                <Icon size={28} />
              </div>
              <h2 className="text-xl font-semibold text-primary">{service.title}</h2>
              <p className="mt-3 leading-7 text-text-muted">{service.text}</p>
            </div>
          );
        })}
      </div>

      <section className="mt-14 rounded-lg bg-primary p-6 text-white md:flex md:items-center md:justify-between md:p-8">
        <div>
          <h2 className="font-display text-3xl">Ready to get started?</h2>
          <p className="mt-2 text-white/70">Chat with us on WhatsApp for product guidance and pricing.</p>
        </div>
        <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white md:mt-0">
          Chat on WhatsApp
        </a>
      </section>
    </div>
  );
}
