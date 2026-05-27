import type { Metadata } from "next";
import Image from "next/image";
import { Award, Heart, ShieldCheck, Tag } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";

export const metadata: Metadata = {
  title: "About Us | Modern Homes",
  description: "Learn about Modern Homes, premium sanitary ware for every Indian home and business.",
  openGraph: {
    title: "About Us | Modern Homes",
    description: "Premium sanitary ware for homes, builders, contractors, and businesses.",
    type: "website",
  },
};

const values = [
  { title: "Quality", text: "Only premium, certified products", icon: ShieldCheck },
  { title: "Integrity", text: "Transparent pricing, no hidden costs", icon: Award },
  { title: "Best Prices", text: "Retail and wholesale rates for all", icon: Tag },
  { title: "Customer First", text: "Your satisfaction is our priority", icon: Heart },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src={getOptimizedUrl("v1779795937/Hero_paralax_fcfsov.png", 1800)}
          alt="Modern Homes showroom"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-36 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Our Story</p>
          <h1 className="mt-4 font-display text-4xl md:text-7xl">About Modern Homes</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-2">
          <Image src={getOptimizedUrl("v1779795924/sanitary_ware_vjmmfl.png", 900)} alt="Premium sanitary ware" fill className="object-cover" />
        </div>
        <div>
          <h2 className="font-display text-4xl text-primary">Our Story</h2>
          <p className="mt-5 leading-8 text-text-muted">
            Modern Homes was founded with one mission: to bring premium sanitary ware to every Indian home and business.
            From a small showroom, we have grown into a trusted partner for builders, contractors, interior designers,
            and homeowners across the region.
          </p>
        </div>
      </section>

      <section className="bg-surface-2 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-8">
            <h3 className="font-display text-3xl text-primary">Mission</h3>
            <p className="mt-4 text-text-muted">Providing quality sanitary ware at the best prices for every Indian home.</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-8">
            <h3 className="font-display text-3xl text-primary">Vision</h3>
            <p className="mt-4 text-text-muted">To be the most trusted sanitary ware brand in the region.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-4xl text-primary">Our Values</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <div className="mb-5 inline-flex rounded-full bg-accent/15 p-3 text-accent">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-primary">{value.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{value.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-6 pb-20 sm:grid-cols-3">
        <AnimatedCounter target={500} label="Products" />
        <AnimatedCounter target={1000} label="Happy Customers" />
        <AnimatedCounter target={10} label="Years in Business" />
      </section>
    </div>
  );
}
