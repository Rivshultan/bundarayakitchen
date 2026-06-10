import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Leaf, Users, Heart, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — BundaRayaKitchen.id" },
      { name: "description", content: "Kisah BundaRayaKitchen.id: misi kami menghadirkan daging segar berkualitas premium langsung ke rumah Anda." },
      { property: "og:title", content: "Tentang BundaRayaKitchen.id" },
      { property: "og:description", content: "Misi kami: daging segar, transparan, dan terpercaya." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <span className="text-xs font-medium tracking-wider uppercase text-primary">Tentang Kami</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">Daging segar bukan lagi sebuah kompromi.</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          BundaRayaKitchen.id lahir dari kegelisahan sederhana: kenapa belanja daging berkualitas harus selalu merepotkan? Kami menjawabnya dengan platform online yang transparan, cepat, dan terpercaya.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl aspect-[4/3] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&q=80" alt="Butcher at work" loading="lazy" width={1200} height={900} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Cerita kami</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Bunda Raya Kitchen bermula dari kios sederhana di Depok. Bapak Rival Akhmadi, pendiri kami, percaya bahwa kualitas daging tidak harus mahal jika pengelolaannya benar.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Kini kami melayani lebih dari 2.400++ pelanggan setia dan memiliki armada pengiriman berpendingin yang siap menjangkau seluruh Indonesia.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Setiap produk yang kami jual sudah melalui seleksi ketat — dari pilihan hewan ternak, proses penyembelihan halal, hingga pengemasan yang higienis.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Yang kami pegang teguh</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: Award, title: "Kualitas Tanpa Kompromi", desc: "Hanya daging grade A yang masuk etalase kami. Setiap potongan diperiksa langsung oleh master butcher." },
            { icon: Leaf, title: "Sumber Terpercaya", desc: "Bekerja sama dengan peternakan lokal bersertifikat halal dan menerapkan standar kesejahteraan hewan." },
            { icon: Users, title: "Untuk Setiap Dapur", desc: "Dari ibu rumah tangga hingga chef profesional — kami menyediakan potongan untuk semua kebutuhan masak." },
            { icon: Heart, title: "Transparansi Penuh", desc: "Kami beri tahu dari mana daging berasal, kapan dipotong, dan bagaimana cara penyimpanannya." },
          ].map((v) => (
            <div key={v.title} className="p-7 rounded-2xl border border-border bg-card flex gap-4" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="w-12 h-12 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--gradient-warm)" }}>
                <v.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{v.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["26+", "Tahun pengalaman"],
            ["2,400+", "Pelanggan setia"],
            ["15+", "Jenis potongan"],
            ["2 jam", "Pengantaran"],
          ].map(([n, l]) => (
            <div key={l} className="p-6 rounded-2xl bg-secondary">
              <div className="text-4xl font-display font-bold text-primary">{n}</div>
              <div className="text-sm text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Sudah tertarik? Lihat etalase kami.</h2>
        <p className="mt-4 text-muted-foreground">Pilih dari koleksi daging sapi, ayam, dan olahan kami yang siap kirim hari ini.</p>
        <Link to="/order" className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90" style={{ boxShadow: "var(--shadow-warm)" }}>
          Lihat Etalase <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </SiteLayout>
  );
}
