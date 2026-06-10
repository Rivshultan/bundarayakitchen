import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart, formatRupiah } from "@/lib/cart";
import { IMAGE_PLACEHOLDER } from "@/lib/useProducts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang — BundaRayaKitchen.id" },
      { name: "description", content: "Tinjau pesanan dan isi form order untuk checkout." },
    ],
  }),
  component: CartPage,
});

const orderSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  phone: z.string().trim().min(8, "Nomor telepon tidak valid").max(20).regex(/^[0-9+\-\s]+$/, "Format nomor tidak valid"),
  address: z.string().trim().min(10, "Alamat minimal 10 karakter").max(500),
  payment: z.enum(["transfer", "cod", "ewallet"]),
  notes: z.string().trim().max(300).optional(),
});

function CartPage() {
  const { items, updateQty, remove, total, clear, count } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "transfer" as "transfer" | "cod" | "ewallet", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (count === 0) {
    return (
      <SiteLayout>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary grid place-items-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Keranjang masih kosong</h1>
          <p className="mt-3 text-muted-foreground">Yuk lihat etalase dan pilih daging favoritmu.</p>
          <Link to="/order" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90">
            Ke Etalase
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const ongkir = 15000;
  const grandTotal = total + ongkir;

  const paymentLabel: Record<typeof form.payment, string> = {
    transfer: "Transfer Bank",
    ewallet: "E-Wallet",
    cod: "COD (Bayar di Tempat)",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      toast.error("Mohon lengkapi data pesanan");
      return;
    }
    setErrors({});
    setSubmitting(true);

    const lines = items
      .map((it) => `• ${it.product.name} (${it.qty} x ${formatRupiah(it.product.price)}) = ${formatRupiah(it.product.price * it.qty)}`)
      .join("\n");

    const message = `*PESANAN BARU - BUNDA RAYA KITCHEN* 🥩
----------------------------------
*Pelanggan:* ${form.name} | ${form.phone}
*Alamat:* ${form.address}

*Pesanan:*
${lines}

*Ongkos Kirim:* ${formatRupiah(ongkir)}
*Metode Pembayaran:* ${paymentLabel[form.payment]}
*Catatan:* ${form.notes?.trim() || "-"}

*TOTAL TAGIHAN:* ${formatRupiah(grandTotal)}
----------------------------------`;

    const url = `https://wa.me/6287882339338?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clear();
    toast.success("Pesanan dialihkan ke WhatsApp");
    setSubmitting(false);
    navigate({ to: "/order" });
  };

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <h1 className="text-4xl font-bold">Keranjang Anda</h1>
        <p className="mt-2 text-muted-foreground">{count} item siap diorder.</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Items + form */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {items.map((it) => (
              <div key={it.product.id} className="p-4 flex gap-4 items-center">
                <img src={it.product.image} alt={it.product.name} onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_PLACEHOLDER; }} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{it.product.name}</h3>
                  <p className="text-xs text-muted-foreground">{formatRupiah(it.product.price)} {it.product.unit}</p>
                  <div className="mt-2 inline-flex items-center border border-border rounded-full">
                    <button onClick={() => updateQty(it.product.id, it.qty - 1)} className="w-7 h-7 grid place-items-center hover:bg-secondary rounded-l-full"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                    <button onClick={() => updateQty(it.product.id, it.qty + 1)} className="w-7 h-7 grid place-items-center hover:bg-secondary rounded-r-full"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{formatRupiah(it.product.price * it.qty)}</div>
                  <button onClick={() => remove(it.product.id)} className="mt-2 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold">Form Pemesanan</h2>

            <Field label="Nama Lengkap" error={errors.name}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="John Doe" />
            </Field>

            <Field label="Nomor WhatsApp" error={errors.phone}>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="08xx-xxxx-xxxx" />
            </Field>

            <Field label="Alamat Pengiriman" error={errors.address}>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={500} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Jalan, nomor rumah, kota, kode pos" />
            </Field>

            <Field label="Metode Pembayaran">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "transfer", l: "Transfer" },
                  { v: "ewallet", l: "E-Wallet" },
                  { v: "cod", l: "COD" },
                ].map((o) => (
                  <button type="button" key={o.v} onClick={() => setForm({ ...form, payment: o.v as typeof form.payment })}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                      form.payment === o.v ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                    }`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Catatan (opsional)" error={errors.notes}>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={300} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Contoh: minta dipotong dadu" />
            </Field>

            <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-60" style={{ boxShadow: "var(--shadow-warm)" }}>
              {submitting ? "Memproses..." : `Buat Pesanan • ${formatRupiah(grandTotal)}`}
            </button>
          </form>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-bold text-lg">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatRupiah(total)} />
              <Row label="Ongkos kirim" value={formatRupiah(ongkir)} />
              <div className="border-t border-border pt-3 mt-3">
                <Row label="Total" value={formatRupiah(grandTotal)} bold />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Pesanan akan dikonfirmasi via WhatsApp dalam 15 menit.</p>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-base" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "text-primary" : "text-foreground"}>{value}</span>
    </div>
  );
}
