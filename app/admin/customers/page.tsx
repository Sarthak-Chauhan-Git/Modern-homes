"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Order, Profile, UserRole } from "@/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);

  const fetchData = async () => {
    const supabase = createClient();
    const [profilesRes, ordersRes] = await Promise.all([
      supabase.from("profiles").select("*").neq("role", "admin").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    if (profilesRes.error) toast.error(profilesRes.error.message);
    else setCustomers((profilesRes.data as Profile[]) || []);
    if (ordersRes.error) toast.error(ordersRes.error.message);
    else setOrders((ordersRes.data as Order[]) || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const orderCounts = useMemo(() => {
    return orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.user_id] = (acc[order.user_id] || 0) + 1;
      return acc;
    }, {});
  }, [orders]);

  const selectedOrders = selected ? orders.filter((order) => order.user_id === selected.id) : [];

  const toggleRole = async (customer: Profile) => {
    const nextRole: UserRole = customer.role === "wholesale" ? "retail" : "wholesale";
    const { error } = await createClient().from("profiles").update({ role: nextRole }).eq("id", customer.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Customer role updated");
      fetchData();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">Customers</h1>
        <p className="mt-1 text-text-muted">View customers and manage retail or wholesale access.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Orders</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="p-3 font-semibold text-primary">{customer.full_name || "Unnamed"}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phone || "-"}</td>
                <td className="p-3"><Badge variant={customer.role === "wholesale" ? "accent" : "outline"}>{customer.role}</Badge></td>
                <td className="p-3 text-center">{orderCounts[customer.id] || 0}</td>
                <td className="p-3 text-text-muted">{new Date(customer.created_at).toLocaleDateString("en-IN")}</td>
                <td className="p-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setSelected(customer)}>View Orders</Button>
                    <Button type="button" size="sm" onClick={() => toggleRole(customer)}>
                      Make {customer.role === "wholesale" ? "Retail" : "Wholesale"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={`${selected?.full_name || "Customer"} Orders`} size="xl">
        <div className="max-h-[60vh] overflow-y-auto">
          {selectedOrders.length === 0 ? (
            <p className="text-text-muted">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {selectedOrders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border p-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="font-semibold text-accent">Rs. {order.total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="mt-1 text-sm text-text-muted">{order.status} • {new Date(order.created_at).toLocaleDateString("en-IN")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
