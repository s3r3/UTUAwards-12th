"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRupiah, partnerProducts } from "@/data/partnerDemo";
import { Package, Plus, Search } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  stock: number;
  status: string;
  updatedAt: string;
};

const dummyProducts: Product[] = partnerProducts.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: formatRupiah(p.price),
  priceValue: p.price,
  stock: p.stock,
  status: p.status === "Pending Approval" ? "Pending Approval" : p.status === "Draft" ? "Draft" : "Active",
  updatedAt: p.updated,
}));

const statusFilters = ["Semua", "Active", "Pending Approval", "Draft"];

export default function PartnerProdukPage() {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/partner/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const list = data?.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setProducts(
            list.map((p: { id: string; name: string; category: string; price: string | number; stock: number | string; status: string; updatedAt?: string }) => ({
              id: String(p.id),
              name: p.name,
              category: p.category,
              price: typeof p.price === "string" ? p.price : formatRupiah(Number(p.price) || 0),
              priceValue: Number(String(p.price).replace(/[^0-9]/g, "")) || 0,
              stock: Number(p.stock) ?? 0,
              status: p.status,
              updatedAt: p.updatedAt ?? new Date().toISOString().slice(0, 10),
            })),
          );
          setIsDemo(false);
        }
      })
      .catch(() => {
        // tetap pakai dummy
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      const matchStatus = status === "Semua" || p.status === status;
      return matchQuery && matchStatus;
    });
  }, [products, query, status]);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 50).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-semibold">{t.partnerDashboard.allProducts}</h1>
            {isDemo && !loading && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Data demo
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {products.length} produk • {lowStock} stok menipis • {outOfStock} habis
          </p>
        </div>
        <Link href="/partner/produk/baru">
          <Button variant="primary">
            <Plus size={18} className="mr-2" /> {t.partnerDashboard.addProduct}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 sm:w-80 dark:border-gray-800 dark:text-gray-400">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
            placeholder={t.partnerDashboard.searchProducts}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : filtered.length === 0 ? (
        <div className="grid h-64 place-items-center rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <div>
            <Package className="mx-auto mb-3 text-gray-400" size={32} />
            <h3 className="text-lg font-semibold">{t.partnerDashboard.noProducts}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t.partnerDashboard.addProductDesc}</p>
            <Link href="/partner/produk/baru">
              <Button variant="primary" className="mt-4">
                {t.partnerDashboard.addProduct}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[760px] table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="p-4 font-semibold">{t.partnerDashboard.productName}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.category}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.price}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.availableStock}</th>
                <th className="p-4 font-semibold">{t.partnerDashboard.status}</th>
                <th className="p-4 font-semibold">Terakhir diubah</th>
                <th className="p-4 font-semibold text-right">{t.partnerDashboard.editProduct}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-400">/{product.id}</p>
                  </td>
                  <td className="p-4 text-sm">{product.category}</td>
                  <td className="p-4 text-sm font-medium">{product.price}</td>
                  <td className="p-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : product.stock < 50
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      }`}
                    >
                      {product.stock === 0 ? "Habis" : `${product.stock} kg`}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : product.status === "Pending Approval"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{product.updatedAt}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/partner/produk/edit/${product.id}`}
                      className="text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      {t.partnerDashboard.editProduct}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
