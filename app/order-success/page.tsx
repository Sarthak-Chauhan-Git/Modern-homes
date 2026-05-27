"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { buildOrderWhatsAppUrl } from "@/lib/utils/whatsapp";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()
      .then(({ data }) => {
        setOrder(data as Order);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  const shortId = orderId?.slice(0, 8).toUpperCase() ?? "--------";

  return (
    <div className="container mx-auto max-w-lg px-4 py-16 text-center md:py-24">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600"
      >
        ✓
      </motion.div>

      <h1 className="font-display text-4xl text-primary">Order Placed Successfully!</h1>
      <p className="mt-3 font-mono text-lg text-accent">Order ID: #{shortId}</p>

      {order ? (
        <>
          <Badge variant="accent" className="mt-4 capitalize">
            {order.order_type}
          </Badge>
          <p className="mt-6 text-3xl font-bold text-primary">
            ₹{Number(order.total).toLocaleString("en-IN")}
          </p>
        </>
      ) : null}

      <p className="mt-4 text-text-muted">
        We&apos;ll reach out shortly to confirm your order.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/products">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
        {order ? (
          <a href={buildOrderWhatsAppUrl(order)} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp">Send WhatsApp Again</Button>
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size={40} />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
