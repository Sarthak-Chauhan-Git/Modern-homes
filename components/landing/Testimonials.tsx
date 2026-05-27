"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Excellent quality products and very professional service.",
    name: "Rajesh Kumar",
    city: "Mumbai",
  },
  {
    quote: "Best wholesale prices in the market. Highly recommend!",
    name: "Priya Sharma",
    city: "Delhi",
  },
  {
    quote: "Our entire hotel bathroom was outfitted through Modern Homes.",
    name: "Amit Patel",
    city: "Ahmedabad",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-text-muted sm:tracking-[0.35em]">
            Testimonials
          </div>
          <h3 className="mt-4 font-display text-4xl text-primary md:text-5xl">
            Trusted by Homeowners & Builders
          </h3>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              animate={{
                opacity: active === index ? 1 : 0.6,
                scale: active === index ? 1 : 0.98,
              }}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-text-muted">“{t.quote}”</p>
              <div className="mt-4 text-sm font-semibold text-primary">
                {t.name}
              </div>
              <div className="text-xs uppercase tracking-widest text-text-muted">
                {t.city}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
