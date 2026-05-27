"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Order, OrderStatus } from "@/types";
import { OrderDetailModal } from "./OrderDetailModal";
import { cn } from "@/lib/utils/cn";

const statusClass: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

interface OrdersTableProps {
  limit?: number;
  orders?: Order[];
  onOrdersChange?: (orders: Order[]) => void;
}

export function OrdersTable({
  limit,
  orders: providedOrders,
  onOrdersChange,
}: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const visibleOrders = providedOrders ?? orders;

  useEffect(() => {
    if (providedOrders) return;

    const fetchOrders = async () => {
      const supabase = createClient();
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) {
        toast.error(error.message);
        return;
      }
      setOrders((data as Order[]) || []);
    };

    void fetchOrders();
  }, [providedOrders, limit]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    const next = visibleOrders.map((order) =>
      order.id === id ? { ...order, status } : order,
    );
    setOrders(next);
    onOrdersChange?.(next);
    setSelected((current) =>
      current && current.id === id ? { ...current, status } : current,
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Type</th>
              <th className="p-3 text-center">Items</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleOrders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer transition hover:bg-surface"
                onClick={() => setSelected(order)}
              >
                <td className="p-3 font-mono text-xs">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="p-3">
                  <div className="font-semibold text-primary">
                    {order.customer_name}
                  </div>
                  <div className="text-xs text-text-muted">
                    {order.customer_phone}
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="outline">{order.order_type}</Badge>
                </td>
                <td className="p-3 text-center">{order.items?.length || 0}</td>
                <td className="p-3 text-right font-semibold">
                  Rs. {order.total.toLocaleString("en-IN")}
                </td>
                <td className="p-3 text-right">
                  Rs. {order.discount_amount.toLocaleString("en-IN")}
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold uppercase",
                      statusClass[order.status],
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-text-muted">
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
            {visibleOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-text-muted">
                  No orders found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <OrderDetailModal
        order={selected}
        onClose={() => setSelected(null)}
        onStatusUpdate={updateStatus}
      />
    </>
  );
}
