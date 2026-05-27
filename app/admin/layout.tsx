import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="fixed inset-0 z-[70] flex overflow-hidden bg-surface-2">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-4 pt-20 md:p-8">{children}</main>
    </div>
  );
}
