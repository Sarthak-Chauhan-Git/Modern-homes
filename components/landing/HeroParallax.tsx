"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO_PARALLAX_IMAGE } from "@/lib/constants/categories";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";

export function HeroParallax() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 900], [0, 180]);
  const heroUrl = getOptimizedUrl(HERO_PARALLAX_IMAGE, 2200);

  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <motion.div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroUrl})`,
          y: backgroundY,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center px-6 text-center text-white">
        <div className="text-xs uppercase tracking-[0.25em] text-white/70 md:text-sm md:tracking-[0.4em]">
          Premium Sanitary Ware
        </div>
        <h1 className="mt-6 font-display text-4xl tracking-[0.14em] md:text-7xl md:tracking-[0.2em] lg:text-8xl">
          MODERN HOMES
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
          Crafted collections for luxury bathrooms, engineered for performance
          and timeless design.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/products">
            <Button variant="primary" size="lg">
              Shop Now
            </Button>
          </Link>
          <a
            href={
              process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP
                ? `https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}`
                : "#"
            }
          >
            <Button variant="ghost" size="lg">
              Get a Quote
            </Button>
          </a>
        </div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
