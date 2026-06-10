import { Link } from "@tanstack/react-router";
import { ShoppingBag, Beef } from "lucide-react";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "var(--gradient-warm)" }}>
              <Beef className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">Daging<span className="text-primary">.</span>id</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/order", label: "Order" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-primary bg-secondary" }}
                inactiveProps={{ className: "text-foreground/70 hover:text-foreground" }}
                className="px-4 py-2 rounded-full transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition text-sm font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Keranjang</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Beef className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-bold">Daging.id</span>
            </div>
            <p className="text-muted-foreground">Daging segar berkualitas, langsung dari pemasok terpercaya ke dapur Anda.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/order" className="hover:text-foreground">Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kontak</h4>
            <p className="text-muted-foreground">Jakarta, Indonesia<br />WhatsApp: 0812-3456-7890<br />halo@daging.id</p>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Daging.id — Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
