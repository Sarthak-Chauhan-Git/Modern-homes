import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { FeaturedProductCard } from './FeaturedProductCard';

export async function FeaturedProducts() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(8);

  return (
    <section className="bg-surface-2 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h3 className="font-display text-4xl text-primary">Featured Products</h3>
          <Link href="/products" className="text-sm font-semibold uppercase tracking-widest text-accent">
            View All →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {(products ?? []).map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
