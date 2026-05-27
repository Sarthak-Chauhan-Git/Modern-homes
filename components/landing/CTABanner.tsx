import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BUSINESS_WHATSAPP_URL } from "@/lib/constants/contact";

export function CTABanner() {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h3 className="font-display text-4xl md:text-5xl">
          Get the Best Prices
        </h3>
        <p className="mt-4 text-base text-white/70">
          Retail and wholesale pricing for every bathroom and project size.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={BUSINESS_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="lg">
              Chat on WhatsApp
            </Button>
          </a>
          <Link href="/products">
            <Button variant="ghost" size="lg">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
