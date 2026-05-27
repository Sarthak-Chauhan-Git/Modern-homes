"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Users, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[72] flex items-center justify-between bg-primary px-4 py-3 text-white md:hidden">
        <Link href="/admin" className="font-display text-xl tracking-[0.16em]">
          MODERN HOMES
        </Link>
        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-full p-2 hover:bg-white/10" aria-label="Toggle admin menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-[56px] z-[72] max-h-[calc(100vh-56px)] overflow-y-auto border-t border-white/10 bg-primary p-4 text-white shadow-xl md:hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold",
                  active ? "bg-accent/20 text-accent" : "text-white/70",
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <button type="button" onClick={logout} className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/70">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      ) : null}

      <aside className="hidden h-full w-64 flex-shrink-0 flex-col bg-primary text-white md:flex">
        <div className="border-b border-white/10 p-6">
          <Link href="/admin" className="font-display text-2xl tracking-[0.18em]">
            MODERN HOMES
          </Link>
          <div className="mt-1 text-xs uppercase tracking-widest text-white/50">Admin Panel</div>
        </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-semibold transition",
                active
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-transparent text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
}
