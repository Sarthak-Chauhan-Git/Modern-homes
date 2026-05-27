"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { buildContactWhatsAppUrl } from "@/lib/utils/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(10, "Please enter a message"),
});

type ContactData = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactData) => {
    const whatsappUrl = buildContactWhatsAppUrl(data);

    const { error } = await createClient()
      .from("contact_inquiries")
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message,
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (whatsappUrl === "#") {
      toast.error("WhatsApp is not configured for this site yet.");
      return;
    }

    window.location.assign(whatsappUrl);

    toast.success("Message sent! We'll be in touch.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("name")}
          placeholder="Name *"
          className={inputClass}
        />
        {errors.name ? (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        ) : null}
      </div>
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className={inputClass}
      />
      <input
        {...register("phone")}
        placeholder="Phone"
        className={inputClass}
      />
      <div>
        <textarea
          {...register("message")}
          placeholder="Message *"
          rows={6}
          className={inputClass}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit" loading={isSubmitting} className="w-full">
        Send Message
      </Button>
    </form>
  );
}
