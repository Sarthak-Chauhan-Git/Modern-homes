"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CartItem, DiscountResult, OrderItem } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cartStore";
import { buildOrderWhatsAppUrl } from "@/lib/utils/whatsapp";
import { INDIAN_STATES } from "@/lib/constants/indianStates";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const addressSchema = z.object({
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pin: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN"),
});

const schema = z
  .object({
    full_name: z.string().min(2, "Name is required"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
    email: z.string().email().optional().or(z.literal("")),
    gstin: z.string().optional(),
    company_name: z.string().optional(),
    same_billing: z.boolean(),
    notes: z.string().optional(),
    shipping: addressSchema,
    billing: addressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.same_billing && !data.billing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Billing address is required",
        path: ["billing", "line1"],
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface CheckoutFormProps {
  orderType: "retail" | "wholesale";
  discountResult: DiscountResult;
  items: CartItem[];
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function CheckoutForm({
  orderType,
  discountResult,
  items,
}: CheckoutFormProps) {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      same_billing: true,
      shipping: { line1: "", line2: "", city: "", state: "", pin: "" },
    },
  });

  const sameBilling = watch("same_billing");

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => {
      const unit =
        orderType === "wholesale" ? item.price_wholesale : item.price_retail;
      return {
        product_id: item.product_id,
        code: item.code,
        name: item.name,
        qty: item.qty,
        unit_price: unit,
        total: unit * item.qty,
      };
    });

    const subtotal = orderItems.reduce((sum, row) => sum + row.total, 0);
    const shipping_address = data.shipping;
    const billing_address = data.same_billing ? shipping_address : data.billing!;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_type: orderType,
        items: orderItems,
        subtotal,
        discount_pct: discountResult.pct,
        discount_amount: discountResult.amount,
        total: discountResult.total,
        shipping_address,
        billing_address,
        customer_name: data.full_name,
        customer_phone: data.phone,
        customer_email: data.email || "",
        gstin: orderType === "wholesale" ? data.gstin : null,
        notes: data.notes,
        whatsapp_sent: true,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    clearCart();

    const orderForWhatsApp = {
      ...order,
      items: orderItems,
      shipping_address,
      billing_address,
      customer_name: data.full_name,
      customer_phone: data.phone,
      customer_email: data.email || "",
      gstin: data.gstin,
    };

    window.open(buildOrderWhatsAppUrl(orderForWhatsApp), "_blank");
    router.push(`/order-success?id=${order.id}`);
    toast.success("Order placed successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid min-w-0 gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h3 className="font-display text-xl text-primary">Contact Information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                {...register("full_name")}
                placeholder="Full Name *"
                className={inputClass}
              />
              {errors.full_name ? (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              ) : null}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder="Phone *"
                className={inputClass}
              />
              {errors.phone ? (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              ) : null}
            </div>
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {orderType === "wholesale" ? (
          <section>
            <h3 className="font-display text-xl text-primary">Business Details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input {...register("gstin")} placeholder="GSTIN" className={inputClass} />
              <input
                {...register("company_name")}
                placeholder="Company Name"
                className={inputClass}
              />
            </div>
          </section>
        ) : null}

        <section>
          <h3 className="font-display text-xl text-primary">Delivery Address</h3>
          <div className="mt-4 grid gap-4">
            <input
              {...register("shipping.line1")}
              placeholder="Address Line 1 *"
              className={inputClass}
            />
            <input
              {...register("shipping.line2")}
              placeholder="Address Line 2"
              className={inputClass}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                {...register("shipping.city")}
                placeholder="City *"
                className={inputClass}
              />
              <select {...register("shipping.state")} className={inputClass}>
                <option value="">State *</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <input
              {...register("shipping.pin")}
              placeholder="PIN Code *"
              className={inputClass}
            />
          </div>
        </section>

        <label className="flex items-center gap-3 text-sm text-primary">
          <input
            type="checkbox"
            {...register("same_billing")}
            className="h-4 w-4 rounded border-border text-accent"
          />
          Billing address same as delivery
        </label>

        {!sameBilling ? (
          <section>
            <h3 className="font-display text-xl text-primary">Billing Address</h3>
            <div className="mt-4 grid gap-4">
              <input
                {...register("billing.line1")}
                placeholder="Address Line 1 *"
                className={inputClass}
              />
              <input
                {...register("billing.line2")}
                placeholder="Address Line 2"
                className={inputClass}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  {...register("billing.city")}
                  placeholder="City *"
                  className={inputClass}
                />
                <select {...register("billing.state")} className={inputClass}>
                  <option value="">State *</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <input
                {...register("billing.pin")}
                placeholder="PIN Code *"
                className={inputClass}
              />
            </div>
          </section>
        ) : null}

        <section>
          <textarea
            {...register("notes")}
            placeholder="Special instructions (optional)"
            rows={4}
            className={cn(inputClass, "resize-none")}
          />
        </section>

        <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
          Place Order
        </Button>
      </div>

      <aside className="h-fit min-w-0 rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <h3 className="font-display text-xl text-primary">Order Summary</h3>
        <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
          {items.map((item) => (
            <li key={item.product_id} className="flex justify-between gap-4">
              <span className="text-text-muted">
                {item.name} × {item.qty}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Discount</span>
            <span>−₹{discountResult.amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Total</span>
            <span className="text-accent">
              ₹{discountResult.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </aside>
    </form>
  );
}
