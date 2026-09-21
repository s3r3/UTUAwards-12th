"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

// Define the validation schema for a new product
const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib"),
  category: z.string().min(1, "Kategori wajib"),
  price: z.string().min(1, "Harga wajib"),
  stock: z.string().min(1, "Stok wajib"),
  status: z.enum(["Active", "Draft", "Pending Approval", "Rejected", "Archived"]),
});

type ProductForm = z.infer<typeof productSchema>;

export default function NewPartnerProductPage() {
  const t = useTranslations();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: "Draft" },
  });

  const onSubmit = async (data: ProductForm) => {
    try {
      const response = await fetch("/api/partner/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          category: data.category,
          description: "",
          images: [],
          price: Number(data.price.replace(/[^0-9]/g, "")),
          wholesalePrice: 0,
          unit: "pcs",
          availableStock: Number(data.stock),
          minimumStock: 0,
          origin: "",
          province: "",
          regency: "",
          district: "",
          village: "",
          sourceType: "",
          specification: "",
          grade: "",
          variant: "",
          weight: 0,
          packaging: "",
          shelfLife: "",
          storage: "",
          b2b: false,
          bulkPricing: 0,
          deliveryArea: "",
          certifications: [],
          status: data.status,
        }),
      });
      if (response.ok) {
        router.push("/partner/produk");
      } else {
        console.error("Failed to create product", await response.text());
      }
    } catch (e) {
      console.error("Error creating product", e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-serif text-2xl font-semibold">{t.partnerDashboard.addProduct}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.partnerDashboard.productName}</label>
          <Input id="name" {...register("name")} placeholder="Nama produk" />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t.partnerDashboard.category}</label>
          <Input id="category" {...register("category")} placeholder="Kategori" />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t.partnerDashboard.price}</label>
          <Input id="price" {...register("price")} placeholder="Harga" />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.price.message}
            </p>
          )}
        </div>
        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">{t.partnerDashboard.availableStock}</label>
          <Input id="stock" {...register("stock")} placeholder="Stok" />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">
              {errors.stock.message}
            </p>
          )}
        </div>
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">{t.partnerDashboard.status}</label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Rejected">Rejected</option>
            <option value="Archived">Archived</option>
                          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>
        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? "Menyimpan..." : t.partnerDashboard.saveDraft}
          </Button>
        </div>
      </form>
    </div>
  );
}
