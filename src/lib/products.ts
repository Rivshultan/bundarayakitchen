import type { Product } from "./cart";
import beefImg from "@/assets/cat-beef.jpg";
import chickenImg from "@/assets/cat-chicken.jpg";
import processedImg from "@/assets/cat-processed.jpg";

export const categories = [
  { id: "sapi", name: "Daging Sapi", image: beefImg, tagline: "Premium cut segar setiap hari" },
  { id: "ayam", name: "Daging Ayam", image: chickenImg, tagline: "Pilihan ayam kampung & broiler" },
  { id: "olahan", name: "Daging Olahan", image: processedImg, tagline: "Sosis, bakso, dan favorit keluarga" },
] as const;

export const products: Product[] = [
  { id: "sapi-1", category: "sapi", name: "Sirloin Steak", price: 185000, unit: "/ 500g", image: beefImg, description: "Potongan sirloin premium, marbling indah, cocok untuk steak rumahan." },
  { id: "sapi-2", category: "sapi", name: "Daging Rendang", price: 145000, unit: "/ 500g", image: beefImg, description: "Daging sapi pilihan untuk rendang, empuk dan kaya rasa." },
  { id: "sapi-3", category: "sapi", name: "Has Dalam (Tenderloin)", price: 220000, unit: "/ 500g", image: beefImg, description: "Bagian paling lembut, ideal untuk grill dan steak." },
  { id: "sapi-4", category: "sapi", name: "Iga Sapi", price: 165000, unit: "/ 500g", image: beefImg, description: "Iga segar untuk sop iga atau BBQ." },

  { id: "ayam-1", category: "ayam", name: "Ayam Broiler Utuh", price: 65000, unit: "/ ekor", image: chickenImg, description: "Ayam broiler segar 1.2-1.4 kg, sudah dibersihkan." },
  { id: "ayam-2", category: "ayam", name: "Fillet Dada Ayam", price: 55000, unit: "/ 500g", image: chickenImg, description: "Dada ayam tanpa tulang & kulit, tinggi protein." },
  { id: "ayam-3", category: "ayam", name: "Paha Ayam Boneless", price: 48000, unit: "/ 500g", image: chickenImg, description: "Paha ayam tanpa tulang, juicy dan praktis." },
  { id: "ayam-4", category: "ayam", name: "Ayam Kampung", price: 95000, unit: "/ ekor", image: chickenImg, description: "Ayam kampung asli, daging padat dan gurih." },

  { id: "olahan-1", category: "olahan", name: "Sosis Sapi Premium", price: 58000, unit: "/ 500g", image: processedImg, description: "Sosis sapi tanpa pengawet, rasa autentik." },
  { id: "olahan-2", category: "olahan", name: "Bakso Sapi Urat", price: 65000, unit: "/ 500g", image: processedImg, description: "Bakso urat kenyal, isi daging asli." },
  { id: "olahan-3", category: "olahan", name: "Smoked Beef", price: 78000, unit: "/ 250g", image: processedImg, description: "Smoked beef siap saji, pas untuk sandwich." },
  { id: "olahan-4", category: "olahan", name: "Nugget Ayam Homemade", price: 42000, unit: "/ 500g", image: processedImg, description: "Nugget ayam buatan rumahan, tanpa MSG." },
];
