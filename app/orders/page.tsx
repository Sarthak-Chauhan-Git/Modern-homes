"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Order, OrderStatus } from "@/types";

const statusVariant: Record<
  OrderStatus,
  "default" | "accent" | "success" | "warning" | "error"
> = {
  pending: "warning",
  confirmed: "accent",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "error",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login?redirect=/orders");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setOrders((data as Order[]) || []);
      setLoading(false);
    };

    void fetchOrders();
  }, [router]);

  const totals = useMemo(() => {
    const totalSpend = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );
    const latestOrder = orders[0];
    return {
      totalOrders: orders.length,
      totalSpend,
      latestOrder,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-28 pt-24 text-center md:pt-20">
        <div className="mb-6 rounded-full bg-surface-2 p-8">
          <ShoppingBag size={64} className="text-border" />
        </div>
        <h1 className="mb-4 font-display text-4xl text-primary">
          You have no orders yet
        </h1>
        <p className="mb-8 text-text-muted">
          Your order history will appear here once you place an order.
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 pb-24 pt-24 md:pb-16 md:pt-28">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-primary md:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Track order status, totals, and delivery updates.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex-1 space-y-6">
          {orders.map((order) => {
            const shortId = order.id.slice(0, 8).toUpperCase();
            const items = order.items || [];
            const extraItems = items.length > 3 ? items.length - 3 : 0;
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-text-muted">
                      Order #{shortId}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {order.order_type}
                    </Badge>
                    <Badge
                      variant={statusVariant[order.status]}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 text-sm text-text-muted">
                    {items.slice(0, 3).map((item) => (
                      <div
                        key={`${order.id}-${item.product_id}`}
                        className="flex justify-between"
                      >
                        <span className="text-primary">
                          {item.name} × {item.qty}
                        </span>
                        <span>
                          ₹{Number(item.total).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    {extraItems > 0 ? (
                      <p className="text-xs text-text-muted">
                        + {extraItems} more items
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-surface-2 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-muted">
                        Order Total
                      </p>
                      <p className="mt-2 text-2xl font-bold text-primary">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-xs text-text-muted">
                      Shipping to {order.shipping_address?.city},{" "}
                      {order.shipping_address?.state}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="w-full flex-shrink-0 lg:w-96">
          <div className="sticky top-28 space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl text-primary">
              Order Summary
            </h2>
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-xs uppercase tracking-widest text-text-muted">
                Total Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">
                {totals.totalOrders}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-xs uppercase tracking-widest text-text-muted">
                Total Spend
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">
                ₹{totals.totalSpend.toLocaleString("en-IN")}
              </p>
            </div>
            {totals.latestOrder ? (
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <p className="text-xs uppercase tracking-widest text-text-muted">
                  Latest Status
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant={statusVariant[totals.latestOrder.status]}
                    className="capitalize"
                  >
                    {totals.latestOrder.status}
                  </Badge>
                  <span className="text-sm text-text-muted">
                    #{totals.latestOrder.id.slice(0, 6).toUpperCase()}
                  </span>
                </div>
              </div>
            ) : null}
            <Link href="/products" className="mt-2">
              <Button variant="secondary" className="w-full mt-4">
                Browse Products
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
