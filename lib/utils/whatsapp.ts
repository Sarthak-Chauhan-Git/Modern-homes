import { BUSINESS_WHATSAPP } from "@/lib/constants/contact";
import { Order } from "@/types";

type ContactInquiry = {
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
};

function buildWhatsAppUrl(message: string): string {
  return BUSINESS_WHATSAPP
    ? `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`
    : "#";
}

export function buildOrderWhatsAppUrl(order: Order): string {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const itemLines = order.items
    .map(
      (i) =>
        `  • ${i.name} (${i.code}) × ${i.qty} = ₹${i.total.toLocaleString("en-IN")}`,
    )
    .join("\n");

  const addr = order.shipping_address;
  const addressStr = `${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city}, ${addr.state} - ${addr.pin}`;

  const message = [
    `🏠 *MODERN HOMES — New Order*`,
    `━━━━━━━━━━━━━━━━━━`,
    `Order ID: *#${shortId}*`,
    `Type: *${order.order_type.toUpperCase()}*`,
    ``,
    `📦 *Items:*`,
    itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `Subtotal: ₹${order.subtotal.toLocaleString("en-IN")}`,
    `Discount (${order.discount_pct}%): -₹${order.discount_amount.toLocaleString("en-IN")}`,
    `*TOTAL: ₹${order.total.toLocaleString("en-IN")}*`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `👤 *Customer:* ${order.customer_name}`,
    `📞 *Phone:* ${order.customer_phone}`,
    `📧 *Email:* ${order.customer_email || "Not provided"}`,
    order.gstin ? `🏢 *GSTIN:* ${order.gstin}` : "",
    ``,
    `📍 *Delivery Address:*`,
    addressStr,
    order.notes ? `\n📝 *Notes:* ${order.notes}` : "",
    ``,
    `Thank you for choosing Modern Homes! 🙏`,
  ]
    .filter(Boolean)
    .join("\n");

  return buildWhatsAppUrl(message);
}

export function buildContactWhatsAppUrl(contact: ContactInquiry): string {
  const message = [
    `🏠 *MODERN HOMES — New Contact Inquiry*`,
    `━━━━━━━━━━━━━━━━━━`,
    `Name: *${contact.name}*`,
    contact.phone ? `📞 Phone: ${contact.phone}` : "",
    contact.email ? `📧 Email: ${contact.email}` : "",
    ``,
    `Message:`,
    contact.message,
    ``,
    `Thank you for contacting Modern Homes! 🙏`,
  ]
    .filter(Boolean)
    .join("\n");

  return buildWhatsAppUrl(message);
}
