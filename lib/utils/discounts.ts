import { CartItem, DiscountSettings, DiscountResult } from "@/types";

export function calculateDiscount(
  items: CartItem[],
  orderType: "retail" | "wholesale",
  settings: DiscountSettings[],
): DiscountResult {
  const setting = settings.find((s) => s.type === orderType)!;
  const subtotal = items.reduce((sum, i) => {
    const price =
      orderType === "wholesale" ? i.price_wholesale : i.price_retail;
    return sum + price * i.qty;
  }, 0);

  if (orderType === "wholesale") {
    const failedQty = items.filter((i) => i.qty < setting.min_order_qty);
    const meetsValue = subtotal >= setting.min_order_value;

    if (failedQty.length > 0) {
      return {
        pct: 0,
        amount: 0,
        total: subtotal,
        eligible: false,
        reason: `Minimum ${setting.min_order_qty} units required per product. Increase qty for: ${failedQty
          .map((i) => i.name)
          .join(", ")}`,
      };
    }

    if (!meetsValue) {
      return {
        pct: 0,
        amount: 0,
        total: subtotal,
        eligible: false,
        reason: `Minimum order value for wholesale is ₹${setting.min_order_value.toLocaleString("en-IN")}`,
      };
    }
  }

  const discountAmount = subtotal * (setting.discount_pct / 100);
  return {
    pct: setting.discount_pct,
    amount: discountAmount,
    total: subtotal - discountAmount,
    eligible: true,
  };
}
