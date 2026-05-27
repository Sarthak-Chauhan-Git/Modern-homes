"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, SUB_CATEGORIES } from "@/lib/constants/categories";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";
import { Product } from "@/types";

const productSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    sub_category: z.string().optional(),
    price_mrp: z.coerce.number().positive("MRP is required"),
    price_retail: z.coerce.number().positive("Retail price is required"),
    price_wholesale: z.coerce.number().positive("Wholesale price is required"),
    min_qty_wholesale: z.coerce.number().int().positive(),
    in_stock: z.boolean(),
    featured: z.boolean(),
  })
  .refine((data) => data.price_retail <= data.price_mrp, {
    message: "Retail price must be less than or equal to MRP",
    path: ["price_retail"],
  })
  .refine((data) => data.price_wholesale <= data.price_retail, {
    message: "Wholesale price must be less than or equal to retail price",
    path: ["price_wholesale"],
  });

export type ProductFormData = z.infer<typeof productSchema> & {
  images: string[];
  specs: Record<string, string>;
};

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

const inputClass = "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm focus:border-accent focus:outline-none";

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [specRows, setSpecRows] = useState(
    Object.entries(initialData?.specs || {}).map(([key, value]) => ({ key, value })) || [],
  );
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      sub_category: initialData?.sub_category || "",
      price_mrp: initialData?.price_mrp || 0,
      price_retail: initialData?.price_retail || 0,
      price_wholesale: initialData?.price_wholesale || 0,
      min_qty_wholesale: initialData?.min_qty_wholesale || 5,
      in_stock: initialData?.in_stock ?? true,
      featured: initialData?.featured ?? false,
    },
  });

  const category = watch("category");
  const subCategories = useMemo(() => SUB_CATEGORIES[category] || [], [category]);

  const submit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const specs = Object.fromEntries(specRows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value.trim()]));
      await onSubmit({ ...data, code: data.code.toUpperCase(), images, specs });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid min-w-0 gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl text-primary">Product Details</h2>
        <input {...register("code")} placeholder="Product Code *" onBlur={(e) => setValue("code", e.target.value.toUpperCase())} className={inputClass} />
        {errors.code ? <p className="text-sm text-red-600">{errors.code.message}</p> : null}
        <input {...register("name")} placeholder="Product Name *" className={inputClass} />
        {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
        <textarea {...register("description")} placeholder="Description" rows={4} className={inputClass} />
        <select {...register("category")} className={inputClass}>
          <option value="">Select category *</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select {...register("sub_category")} className={inputClass}>
          <option value="">Select sub-category</option>
          {subCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl text-primary">Pricing</h2>
        <input type="number" {...register("price_mrp")} placeholder="MRP *" className={inputClass} />
        <input type="number" {...register("price_retail")} placeholder="Retail Price *" className={inputClass} />
        {errors.price_retail ? <p className="text-sm text-red-600">{errors.price_retail.message}</p> : null}
        <input type="number" {...register("price_wholesale")} placeholder="Wholesale Price *" className={inputClass} />
        {errors.price_wholesale ? <p className="text-sm text-red-600">{errors.price_wholesale.message}</p> : null}
        <input type="number" {...register("min_qty_wholesale")} placeholder="Minimum wholesale quantity" className={inputClass} />
        <label className="flex items-center gap-3 text-sm font-semibold text-primary">
          <input type="checkbox" {...register("in_stock")} className="h-4 w-4 rounded border-border text-accent" />
          In Stock
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-primary">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-border text-accent" />
          Featured
        </label>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-primary">Specifications</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => setSpecRows((rows) => [...rows, { key: "", value: "" }])}>
            Add Specification
          </Button>
        </div>
        {specRows.map((row, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input value={row.key} onChange={(e) => setSpecRows((rows) => rows.map((r, i) => (i === index ? { ...r, key: e.target.value } : r)))} placeholder="Key" className={inputClass} />
            <input value={row.value} onChange={(e) => setSpecRows((rows) => rows.map((r, i) => (i === index ? { ...r, value: e.target.value } : r)))} placeholder="Value" className={inputClass} />
            <Button type="button" variant="danger" size="sm" className="w-full md:w-auto" onClick={() => setSpecRows((rows) => rows.filter((_, i) => i !== index))}>
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-sm lg:col-span-2">
        <h2 className="font-display text-2xl text-primary">Images</h2>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{ multiple: true, maxFiles: 8, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"], maxFileSize: 5000000 }}
          onSuccess={(result) => {
            const info = result.info as { secure_url?: string };
            if (info.secure_url) setImages((current) => [...current, info.secure_url!]);
            else toast.error("Upload completed without a URL");
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full rounded-lg border-2 border-dashed border-border p-8 text-center transition hover:border-accent"
            >
              <Upload className="mx-auto mb-2 text-text-muted" size={32} />
              <span className="block font-semibold text-primary">Click to upload images</span>
              <span className="mt-1 block text-sm text-text-muted">JPG, PNG, WebP up to 5MB each</span>
            </button>
          )}
        </CldUploadWidget>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-2">
              <Image src={getOptimizedUrl(image, 300)} alt="Product image" fill className="object-cover" />
              <button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white">
                <X size={14} />
              </button>
              {index === 0 ? <span className="absolute bottom-1 left-1 rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-white">Primary</span> : null}
            </div>
          ))}
        </div>
      </section>

      <div className="lg:col-span-2">
        <Button type="submit" loading={saving} size="lg" className="w-full">
          Save Product
        </Button>
      </div>
    </form>
  );
}
