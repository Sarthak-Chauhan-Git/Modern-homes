"use client";

import { motion } from "framer-motion";
import { MessageCircle, Package, Tag, Truck } from "lucide-react";

const cards = [
  {
    title: "500+ Products",
    description: "Curated selection of premium sanitary ware",
    icon: Package,
  },
  {
    title: "Best Trade Prices",
    description: "Competitive pricing for retail & wholesale",
    icon: Tag,
  },
  {
    title: "Expert Guidance",
    description: "Our specialists help you choose the right fit",
    icon: MessageCircle,
  },
  {
    title: "Fast Dispatch",
    description: "Prompt order processing and delivery",
    icon: Truck,
  },
];

export function WhyUs() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-text-muted sm:tracking-[0.35em]">
            Why Modern Homes
          </div>
          <h3 className="mt-4 font-display text-4xl text-primary md:text-5xl">
            Crafted for Premium Spaces
          </h3>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <card.icon size={20} />
              </div>
              <h4 className="mt-5 text-lg font-semibold text-primary">{card.title}</h4>
              <p className="mt-2 text-sm text-text-muted">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
