import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Clock } from "lucide-react";
import heroImg from "@/assets/hero-meat.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daging.id — Daging Segar Sampai ke Pintu Rumah" },
      { name: "description", content: "Belanja daging sapi, ayam, dan daging olahan segar berkualitas premium. Pesan online, antar cepat." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden isolate">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center text-primary-foreground">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/10 text-xs font-medium tracking-wider uppercase backdrop-blur-sm border border-primary-foreground/20">
              Segar • Higienis • Antar Cepat
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight">
              Daging berkualitas, <span className="italic" style={{ color: "oklch(0.85 0.14 60)" }}>langsung</span> ke dapur Anda.
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80 max-w-md">
              Dipotong hari ini, dikemas higienis, dikirim hari ini juga. Tidak perlu repot ke pasar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/order" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-foreground text-foreground font-semibold hover:scale-105 transition-transform" style={{ boxShadow: "var(--shadow-warm)" }}>
                Pesan Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary-foreground/30 hover:bg-primary-foreground/10 transition">
                Tentang Kami
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Premium beef cuts" width={1600} height={1024} className="rounded-2xl shadow-2xl aspect-[4/3] object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-background text-foreground rounded-2xl px-5 py-4 shadow-xl hidden sm:block">
              <div className="text-3xl font-display font-bold text-primary">4.9★</div>
              <div className="text-xs text-muted-foreground">2,400+ pelanggan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: "Pengantaran Cepat", desc: "Sampai dalam 2 jam di area Jakarta." },
          { icon: ShieldCheck, title: "Higienis & Halal", desc: "Bersertifikat halal MUI, dikemas vakum." },
          { icon: Clock, title: "Dipotong Hari Ini", desc: "Selalu segar, langsung dari pemasok." },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-2xl bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <f.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Categories preview */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Pilihan kami</h2>
            <p className="text-muted-foreground mt-2">Tiga kategori, semuanya premium.</p>
          </div>
          <Link to="/order" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Lihat etalase <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {categories.map((c) => (
            <Link key={c.id} to="/order" className="group relative overflow-hidden rounded-2xl aspect-[4/5] block">
              <img src={c.image} alt={c.name} loading="lazy" width={800} height={800} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-bold">{c.name}</h3>
                <p className="text-sm text-white/80 mt-1">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-3xl p-10 md:p-14 text-center text-primary-foreground" style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}>
          <h2 className="text-3xl md:text-4xl font-bold">Siap masak yang istimewa?</h2>
          <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">Pesan sekarang dan rasakan daging premium di rumah Anda hari ini juga.</p>
          <Link to="/order" className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-background text-foreground font-semibold hover:scale-105 transition">
            Mulai Belanja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
