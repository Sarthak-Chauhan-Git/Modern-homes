"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { CATEGORY_TILES } from "@/lib/constants/categories";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";

export function CategoryGrid() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-text-muted sm:tracking-[0.35em]">
            Explore Our Range
          </div>
          <h2 className="mt-4 font-display text-4xl text-primary md:text-5xl">
            Category Collections
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_TILES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <Image
                  src={getOptimizedUrl(cat.image, 700)}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-base font-semibold">{cat.name}</span>
                  <ChevronRight size={18} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-accent opacity-0 transition group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
