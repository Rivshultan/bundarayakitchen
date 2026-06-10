import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Beef,
  Package,
  ClipboardList,
  Store,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  Tags,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  StickyNote,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/products";
import { formatRupiah } from "@/lib/cart";
import { supabase, type ProdukRow } from "@/integrations/supabase/client";
import { IMAGE_PLACEHOLDER } from "@/lib/useProducts";
import { toast } from "sonner";
import { X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — BundaRayaKitchen.id" },
      { name: "description", content: "Panel admin untuk mengelola etalase dan pesanan BundaRayaKitchen.id" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type View = "etalase" | "pesanan";
type KategoriId = "sapi" | "ayam" | "olahan";

type DummyOrder = {
  id: string;
  customer: string;
  phone: string;
  date: string;
  address: string;
  note: string;
  items: { name: string; qty: number; price: number }[];
};

const dummyOrders: DummyOrder[] = [
  {
    id: "BRK-1042",
    customer: "Ibu Siti Aminah",
    phone: "0812-3456-7890",
    date: "12 Juni 2026",
    address: "Jl. Margonda Raya No. 88, Depok",
    note: "Tolong dipotong dadu kecil, kirim sebelum jam 10 pagi.",
    items: [
      { name: "Sirloin Steak", qty: 2, price: 185000 },
      { name: "Sosis Sapi Premium", qty: 1, price: 58000 },
    ],
  },
  {
    id: "BRK-1041",
    customer: "Bapak Andi Wijaya",
    phone: "0856-7788-9900",
    date: "11 Juni 2026",
    address: "Perumahan Grand Depok City Blok C5, Depok",
    note: "—",
    items: [
      { name: "Daging Rendang", qty: 3, price: 145000 },
      { name: "Bakso Sapi Urat", qty: 2, price: 65000 },
    ],
  },
  {
    id: "BRK-1040",
    customer: "Ibu Rina Pratiwi",
    phone: "0878-1122-3344",
    date: "11 Juni 2026",
    address: "Jl. Tole Iskandar No. 45, Depok",
    note: "Tolong packing terpisah, untuk dua alamat.",
    items: [
      { name: "Ayam Kampung", qty: 2, price: 95000 },
      { name: "Fillet Dada Ayam", qty: 1, price: 55000 },
      { name: "Nugget Ayam Homemade", qty: 2, price: 42000 },
    ],
  },
];

const categoryColor: Record<string, string> = {
  sapi: "bg-primary/15 text-primary border-primary/20",
  ayam: "bg-accent/30 text-accent-foreground border-accent/40",
  olahan: "bg-secondary text-secondary-foreground border-border",
};

function AdminPage() {
  const [view, setView] = useState<View>("etalase");
  const [items, setItems] = useState<ProdukRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<ProdukRow | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "sapi" as KategoriId,
    price: "",
    description: "",
    catatan: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      toast.error("Gagal memuat produk: " + error.message);
    } else {
      setItems((data ?? []) as ProdukRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const stats = useMemo(() => {
    const totalOmset = dummyOrders.reduce(
      (s, o) => s + o.items.reduce((a, b) => a + b.price * b.qty, 0),
      0,
    );
    const activeCats = new Set(items.map((i) => i.kategori)).size;
    return {
      products: items.length,
      orders: dummyOrders.length,
      omset: totalOmset,
      cats: activeCats,
    };
  }, [items]);

  const ordersBadge = dummyOrders.length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Nama dan harga wajib diisi");
      return;
    }
    if (!file) {
      toast.error("Silakan pilih foto produk");
      return;
    }
    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
      const gambar_url = pub.publicUrl;

      const { error: insErr } = await supabase.from("produk").insert({
        nama: form.name,
        kategori: form.category,
        harga: parseInt(form.price, 10),
        deskripsi: form.description || "",
        catatan: form.catatan || "",
        gambar_url,
      });
      if (insErr) throw insErr;

      toast.success("Produk berhasil ditambahkan ke etalase");
      setForm({ name: "", category: "sapi", price: "", description: "", catatan: "" });
      setFile(null);
      const fileInput = document.getElementById("image") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      await fetchItems();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + (err?.message ?? "unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("produk").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus: " + error.message);
      return;
    }
    toast.success("Produk dihapus");
    await fetchItems();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card/50 hidden md:flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-full grid place-items-center"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Beef className="w-5 h-5 text-primary-foreground" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-base font-bold">BundaRayaKitchen</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          <SidebarBtn
            active={view === "etalase"}
            onClick={() => setView("etalase")}
            icon={<Package className="w-4 h-4" />}
            label="Kelola Etalase"
          />
          <SidebarBtn
            active={view === "pesanan"}
            onClick={() => setView("pesanan")}
            icon={<ClipboardList className="w-4 h-4" />}
            label="Pesanan Masuk"
            badge={ordersBadge}
          />
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:bg-secondary hover:text-foreground transition"
          >
            <Store className="w-4 h-4" />
            <span>Lihat Toko</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          © {new Date().getFullYear()} BundaRayaKitchen.id
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar mobile */}
        <div className="md:hidden border-b border-border p-3 flex gap-2 overflow-x-auto">
          <MobileTab active={view === "etalase"} onClick={() => setView("etalase")}>
            <Package className="w-4 h-4" /> Etalase
          </MobileTab>
          <MobileTab active={view === "pesanan"} onClick={() => setView("pesanan")}>
            <ClipboardList className="w-4 h-4" /> Pesanan
            <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] rounded-full bg-primary text-primary-foreground px-1">
              {ordersBadge}
            </span>
          </MobileTab>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-border whitespace-nowrap"
          >
            <Store className="w-4 h-4" /> Toko
          </Link>
        </div>

        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              {view === "etalase" ? "Kelola Etalase" : "Pesanan Masuk"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {view === "etalase"
                ? "Kelola produk yang tampil di toko Anda."
                : "Daftar pesanan pelanggan terbaru."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Package className="w-5 h-5" />} label="Total Produk" value={stats.products.toString()} />
            <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Pesanan Masuk" value={stats.orders.toString()} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Omset" value={formatRupiah(stats.omset)} />
            <StatCard icon={<Tags className="w-5 h-5" />} label="Kategori Aktif" value={stats.cats.toString()} />
          </div>

          {view === "etalase" ? (
            <div className="space-y-8">
              {/* Form */}
              <Card className="border-border/70" style={{ boxShadow: "var(--shadow-card)" }}>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Tambah Produk Baru</CardTitle>
                  <CardDescription>Lengkapi data produk untuk ditampilkan di etalase.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="cth. Wagyu A5 Slice"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kategori</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => setForm({ ...form, category: v as KategoriId })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Harga (Rp)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="cth. 250000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Foto Produk</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="desc">Deskripsi Singkat</Label>
                      <Textarea
                        id="desc"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Tuliskan keunggulan produk..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="catatan">Catatan (opsional)</Label>
                      <Textarea
                        id="catatan"
                        value={form.catatan}
                        onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                        placeholder="Catatan internal..."
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {submitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                        ) : (
                          <><Plus className="w-4 h-4" /> Simpan ke Etalase</>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* List */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-4">Daftar Etalase Saat Ini</h2>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" /> Memuat produk...
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
                    Belum ada produk. Tambahkan produk pertama Anda di form atas.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((p) => (
                      <Card key={p.id} className="overflow-hidden group">
                        <div className="aspect-[4/3] bg-muted overflow-hidden">
                          {p.gambar_url ? (
                            <img
                              src={p.gambar_url}
                              alt={p.nama}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
                              Tanpa Gambar
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold leading-tight">{p.nama}</h3>
                            <Badge
                              variant="outline"
                              className={categoryColor[p.kategori] ?? "bg-secondary text-secondary-foreground border-border"}
                            >
                              {categories.find((c) => c.id === p.kategori)?.name ?? p.kategori}
                            </Badge>
                          </div>
                          <p className="text-primary font-display text-lg font-bold">
                            {formatRupiah(p.harga)}
                          </p>
                          {p.deskripsi && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{p.deskripsi}</p>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info("Fitur edit akan datang")}>
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {dummyOrders.map((o) => {
                const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
                return (
                  <Card key={o.id} style={{ boxShadow: "var(--shadow-card)" }}>
                    <CardHeader className="border-b border-border">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-primary text-primary-foreground">#{o.id}</Badge>
                            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">Baru</Badge>
                          </div>
                          <CardTitle className="font-display text-lg">{o.customer}</CardTitle>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                            <Phone className="w-3.5 h-3.5" /> {o.phone}
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                            <Calendar className="w-3.5 h-3.5" /> Kirim: {o.date}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <div>
                            <div className="font-medium">Alamat</div>
                            <div className="text-muted-foreground">{o.address}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <StickyNote className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          <div>
                            <div className="font-medium">Catatan</div>
                            <div className="text-muted-foreground">{o.note}</div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-secondary/60 text-secondary-foreground">
                            <tr>
                              <th className="text-left px-4 py-2 font-medium">Item</th>
                              <th className="text-center px-4 py-2 font-medium w-16">Qty</th>
                              <th className="text-right px-4 py-2 font-medium">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((it, idx) => (
                              <tr key={idx} className="border-t border-border">
                                <td className="px-4 py-2">{it.name}</td>
                                <td className="px-4 py-2 text-center">{it.qty}</td>
                                <td className="px-4 py-2 text-right">{formatRupiah(it.price * it.qty)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-border bg-muted/40">
                              <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total Tagihan</td>
                              <td className="px-4 py-3 text-right font-display text-lg font-bold text-primary">
                                {formatRupiah(total)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">Tandai Diproses</Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          Konfirmasi Pesanan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarBtn({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-primary text-primary-foreground shadow"
          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold grid place-items-center ${
            active ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
        active ? "bg-primary text-primary-foreground" : "border border-border"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="border-border/70" style={{ boxShadow: "var(--shadow-card)" }}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span
            className="w-9 h-9 rounded-full grid place-items-center text-primary-foreground"
            style={{ background: "var(--gradient-warm)" }}
          >
            {icon}
          </span>
        </div>
        <div className="font-display text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
