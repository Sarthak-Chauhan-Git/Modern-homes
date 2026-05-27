"use client";

import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Order, OrderStatus } from "@/types";
import { buildOrderWhatsAppUrl } from "@/lib/utils/whatsapp";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: OrderStatus) => Promise<void>;
}

export function OrderDetailModal({ order, onClose, onStatusUpdate }: OrderDetailModalProps) {
  if (!order) return null;

  const address = order.shipping_address;

  return (
    <Modal isOpen={Boolean(order)} onClose={onClose} title={`Order #${order.id.slice(0, 8).toUpperCase()}`} size="xl">
      <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-primary">Customer</h3>
            <div className="mt-2 text-sm text-text-muted">
              <p>{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              <p>{order.customer_email || "No email"}</p>
              {order.gstin ? <p>GSTIN: {order.gstin}</p> : null}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-primary">Shipping Address</h3>
            <p className="mt-2 text-sm text-text-muted">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} - {address.pin}
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-primary">Items</h3>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Name</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={`${item.product_id}-${item.code}`}>
                    <td className="p-3 font-mono">{item.code}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-center">{item.qty}</td>
                    <td className="p-3 text-right">Rs. {item.unit_price.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right font-semibold">Rs. {item.total.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg bg-surface-2 p-4">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span>Rs. {order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-text-muted">
            <span>Discount ({order.discount_pct}%)</span>
            <span>-Rs. {order.discount_amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-3 flex justify-between text-lg font-bold text-primary">
            <span>Total</span>
            <span>Rs. {order.total.toLocaleString("en-IN")}</span>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={order.status}
            onChange={async (e) => {
              await onStatusUpdate(order.id, e.target.value as OrderStatus);
              toast.success("Order status updated");
            }}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm capitalize focus:border-accent focus:outline-none sm:w-auto"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button type="button" variant="whatsapp" onClick={() => window.open(buildOrderWhatsAppUrl(order), "_blank")}>
            <MessageCircle size={18} />
            Open WhatsApp
          </Button>
        </div>
      </div>
    </Modal>
  );
}
