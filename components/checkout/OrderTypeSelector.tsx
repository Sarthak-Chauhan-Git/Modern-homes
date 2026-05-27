"use client";

import { DiscountSettings } from "@/types";
import { cn } from "@/lib/utils/cn";

interface OrderTypeSelectorProps {
  settings: DiscountSettings[];
  onSelect: (type: "retail" | "wholesale") => void;
}

export function OrderTypeSelector({ settings, onSelect }: OrderTypeSelectorProps) {
  const retail = settings.find((s) => s.type === "retail");
  const wholesale = settings.find((s) => s.type === "wholesale");

  if (!retail || !wholesale) {
    return (
      <p className="text-center text-text-muted">
        Unable to load discount settings. Please try again later.
      </p>
    );
  }

  const cards = [
    {
      type: "retail" as const,
      title: "Retail Order",
      badge: `${retail.discount_pct}% off`,
      points: [
        "No minimum quantity",
        "No minimum order value",
        "For individuals & home use",
      ],
    },
    {
      type: "wholesale" as const,
      title: "Wholesale Order",
      badge: `${wholesale.discount_pct}% off`,
      points: [
        `Min ${wholesale.min_order_qty} units per product`,
        `Min order ₹${wholesale.min_order_value.toLocaleString("en-IN")}`,
        "Best trade prices for businesses",
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map((card) => (
        <button
          key={card.type}
          type="button"
          onClick={() => onSelect(card.type)}
          className={cn(
            "rounded-2xl border-2 border-border bg-white p-8 text-left transition",
            "hover:border-accent hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          )}
        >
          <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
            {card.badge}
          </span>
          <h3 className="mt-4 font-display text-2xl text-primary">{card.title}</h3>
          <ul className="mt-4 space-y-2 text-sm text-text-muted">
            {card.points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
}
