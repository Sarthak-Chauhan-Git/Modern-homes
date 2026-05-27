"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { DiscountSettings } from "@/types";

type SettingsForm = Pick<DiscountSettings, "type" | "discount_pct" | "min_order_qty" | "min_order_value">;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsForm[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSettings = async () => {
    const { data, error } = await createClient().from("discount_settings").select("*").order("type");
    if (error) toast.error(error.message);
    else setSettings((data as DiscountSettings[]) || []);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (type: string, patch: Partial<SettingsForm>) => {
    setSettings((rows) => rows.map((row) => (row.type === type ? { ...row, ...patch } : row)));
  };

  const save = async (row: SettingsForm) => {
    setSaving(row.type);
    const { error } = await createClient()
      .from("discount_settings")
      .update({
        discount_pct: Number(row.discount_pct),
        min_order_qty: Number(row.min_order_qty),
        min_order_value: Number(row.min_order_value),
      })
      .eq("type", row.type);
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-primary">Settings</h1>
        <p className="mt-1 text-text-muted">Manage retail and wholesale discounts.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {settings.map((row) => (
          <div key={row.type} className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl capitalize text-primary">{row.type} Settings</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-primary">
                Discount %
                <input type="number" value={row.discount_pct} onChange={(e) => updateSetting(row.type, { discount_pct: Number(e.target.value) })} className="mt-2 w-full rounded-lg border border-border px-4 py-3" />
              </label>
              {row.type === "wholesale" ? (
                <>
                  <label className="block text-sm font-semibold text-primary">
                    Minimum Qty Per Item
                    <input type="number" value={row.min_order_qty} onChange={(e) => updateSetting(row.type, { min_order_qty: Number(e.target.value) })} className="mt-2 w-full rounded-lg border border-border px-4 py-3" />
                  </label>
                  <label className="block text-sm font-semibold text-primary">
                    Minimum Order Value
                    <input type="number" value={row.min_order_value} onChange={(e) => updateSetting(row.type, { min_order_value: Number(e.target.value) })} className="mt-2 w-full rounded-lg border border-border px-4 py-3" />
                  </label>
                </>
              ) : null}
              <Button type="button" loading={saving === row.type} onClick={() => save(row)}>
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
