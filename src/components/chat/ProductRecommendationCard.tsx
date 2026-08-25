"use client";
import { useCartStore } from "@/store/cart.store";

type RecProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

type Props = {
  products: RecProduct[];
  totalPrice: number;
};

export default function ProductRecommendationCard({ products, totalPrice }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function addAll() {
    products.forEach((p) => addItem({ productId: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock }));
  }

  return (
    <div className="space-y-2">
      <div className="flex max-h-36 gap-2 overflow-x-auto pb-1">
        {products.map((p) => (
          <div key={p.id} className="flex h-24 w-28 shrink-0 flex-col items-center rounded-xl border p-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
              {p.image ? <img src={p.image} alt={p.name} className="h-full w-full rounded-full object-cover" /> : (p.name ?? "?")[0]?.toUpperCase()}
            </div>
            <p className="mt-1 line-clamp-2 text-xs">{p.name}</p>
            <p className="text-xs font-semibold">Rp {p.price.toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>

      <button
        onClick={addAll}
        className="w-full rounded-full bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700"
      >
        Tambahkan Semua ke Keranjang
      </button>
    </div>
  );
}
