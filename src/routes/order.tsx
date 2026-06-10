import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus, ShoppingBag, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { categories } from "@/lib/products";
import { useCart, formatRupiah, type Product } from "@/lib/cart";
import { useProducts, IMAGE_PLACEHOLDER } from "@/lib/useProducts";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Etalase — BundaRayaKitchen.id" },
      { name: "description", content: "Lihat dan pesan daging sapi, ayam, dan olahan langsung dari etalase kami." },
      { property: "og:title", content: "Etalase BundaRayaKitchen.id" },
      { property: "og:description", content: "Pilih dari berbagai potongan daging premium siap kirim hari ini." },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const [active, setActive] = useState<"sapi" | "ayam" | "olahan">("sapi");
  const [selected, setSelected] = useState<Product | null>(null);
  const { products, loading } = useProducts();

  const filtered = products.filter((p) => p.category === active);

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <span className="text-xs font-medium tracking-wider uppercase text-primary">Etalase</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold">Pilih daging favorit Anda</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Klik produk untuk melihat detail dan masukkan ke keranjang.</p>
      </section>

      {/* Category tabs */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition border ${
                active === c.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Category banner */}
      <section className="max-w-6xl mx-auto px-6 mt-6">
        {categories.filter((c) => c.id === active).map((c) => (
          <div key={c.id} className="relative h-40 md:h-52 rounded-2xl overflow-hidden">
            <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" width={1200} height={400} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 text-white">
              <h2 className="font-display text-3xl md:text-4xl font-bold">{c.name}</h2>
              <p className="text-white/80 text-sm mt-1">{c.tagline}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Product grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Memuat produk...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 border border-dashed rounded-2xl">
            Belum ada produk pada kategori ini.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="group text-left bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={400}
                    height={400}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_PLACEHOLDER; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{p.name}</h3>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-primary font-bold">{formatRupiah(p.price)}</span>
                    <span className="text-xs text-muted-foreground">{p.unit}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && <ProductDialog product={selected} onClose={() => setSelected(null)} />}
    </SiteLayout>
  );
}

function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    add(product, qty);
    toast.success(`${product.name} ditambahkan ke keranjang`, { description: `${qty} ${product.unit}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-background rounded-3xl max-w-3xl w-full overflow-hidden grid md:grid-cols-2 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 grid place-items-center rounded-full bg-background/80 backdrop-blur hover:bg-background">
          <X className="w-4 h-4" />
        </button>
        <img src={product.image} alt={product.name} className="w-full h-64 md:h-full object-cover" width={600} height={600} />
        <div className="p-7 flex flex-col">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Daging segar</span>
          <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-primary">{formatRupiah(product.price)}</span>
            <span className="text-sm text-muted-foreground">{product.unit}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium">Jumlah</span>
            <div className="inline-flex items-center border border-border rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 grid place-items-center hover:bg-secondary rounded-l-full"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9 grid place-items-center hover:bg-secondary rounded-r-full"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="mt-auto pt-6 flex gap-3">
            <button onClick={handleAdd} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90" style={{ boxShadow: "var(--shadow-warm)" }}>
              <ShoppingBag className="w-4 h-4" /> Masukkan Keranjang
            </button>
            <Link to="/cart" className="px-5 py-3 rounded-full border border-border hover:bg-secondary text-sm font-medium grid place-items-center">Cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
