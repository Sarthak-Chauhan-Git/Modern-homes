import { HeroParallax } from '@/components/landing/HeroParallax';
import { CategoryGrid } from '@/components/landing/CategoryGrid';
import { FeaturedProducts } from '@/components/landing/FeaturedProducts';
import { WhyUs } from '@/components/landing/WhyUs';
import { CTABanner } from '@/components/landing/CTABanner';
import { Testimonials } from '@/components/landing/Testimonials';

export const metadata = {
  title: "Modern Homes | Premium Sanitary Ware",
  description: "Shop premium sanitary ware, faucets, showers, sanitary ware, water heaters, and bath fittings at Modern Homes.",
  openGraph: {
    title: "Modern Homes | Premium Sanitary Ware",
    description: "Retail and wholesale sanitary ware for every Indian home and business.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroParallax />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyUs />
      <CTABanner />
      <Testimonials />
    </>
  );
}
