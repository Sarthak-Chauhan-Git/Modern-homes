import { CalendarDays, Clock, IndianRupee, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Dashboard | Admin | Modern Homes" };

export default async function AdminDashboard() {
  const supabase = createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, monthOrders, customers] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total").gte("created_at", startOfMonth.toISOString()),
    supabase.from("profiles").select("id", { count: "exact", head: true }).neq("role", "admin"),
  ]);

  const revenue = (monthOrders.data || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">Dashboard</h1>
        <p className="mt-1 text-text-muted">Live store overview and recent order activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Today's Orders" value={String(todayOrders.count || 0)} icon={CalendarDays} color="gold" />
        <StatsCard title="Pending Orders" value={String(pendingOrders.count || 0)} icon={Clock} color="red" />
        <StatsCard title="Revenue MTD" value={`Rs. ${revenue.toLocaleString("en-IN")}`} icon={IndianRupee} color="green" />
        <StatsCard title="Customers" value={String(customers.count || 0)} icon={Users} color="blue" />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl text-primary">Recent Orders</h2>
        <OrdersTable limit={10} />
      </section>
    </div>
  );
}
