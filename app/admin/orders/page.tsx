"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { Order, OrderStatus, OrderType } from "@/types";

const statuses: ("all" | OrderStatus)[] = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [type, setType] = useState<"all" | OrderType>("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await createClient().from("orders").select("*").order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setOrders((data as Order[]) || []);
    };
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const created = new Date(order.created_at);
      const matchesStatus = status === "all" || order.status === status;
      const matchesType = type === "all" || order.order_type === type;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || order.customer_name.toLowerCase().includes(q) || order.id.toLowerCase().startsWith(q.replace("#", ""));
      const matchesFrom = !from || created >= new Date(from);
      const matchesTo = !to || created <= new Date(`${to}T23:59:59`);
      return matchesStatus && matchesType && matchesSearch && matchesFrom && matchesTo;
    });
  }, [orders, status, type, search, from, to]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl text-primary">Orders</h1>
          <p className="mt-1 text-text-muted">Filter, inspect, and update order status.</p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                status === item ? "bg-accent text-white" : "bg-surface-2 text-text-muted hover:text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Customer or order ID" className="rounded-lg border border-border px-4 py-2 text-sm" />
          <select value={type} onChange={(e) => setType(e.target.value as "all" | OrderType)} className="rounded-lg border border-border px-4 py-2 text-sm">
            <option value="all">All Types</option>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-border px-4 py-2 text-sm" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-border px-4 py-2 text-sm" />
        </div>
      </div>

      <OrdersTable orders={filtered} onOrdersChange={setOrders} />
    </div>
  );
}
