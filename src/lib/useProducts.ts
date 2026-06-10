import { useEffect, useState, useCallback } from "react";
import { supabase, type ProdukRow } from "@/integrations/supabase/client";
import type { Product } from "./cart";

export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23e5e7eb'/><text x='50%' y='50%' fill='%239ca3af' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='18'>Tanpa Gambar</text></svg>`
  );

export function rowToProduct(r: ProdukRow): Product {
  return {
    id: String(r.id),
    name: r.nama,
    category: (r.kategori as Product["category"]) ?? "sapi",
    price: r.harga,
    unit: "/ pack",
    image: r.gambar_url || IMAGE_PLACEHOLDER,
    description: r.deskripsi ?? "",
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: false });
    setProducts(((data ?? []) as ProdukRow[]).map(rowToProduct));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, refresh };
}
