import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jqqdlngmusacrspjoyiy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcWRsbmdtdXNhY3JzcGpveWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2Mjk0OTMsImV4cCI6MjA5NTIwNTQ5M30.ZuZuJhQ3l1_bFM02kHa8RmMH3trWS76ufXH5evUiY5Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type ProdukRow = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  deskripsi: string | null;
  catatan: string | null;
  gambar_url: string | null;
};

export type PesananItem = {
  id_produk: number;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
};

export type PesananRow = {
  id: number;
  created_at: string;
  nama: string;
  hp: string;
  tanggal_kirim: string;
  alamat: string;
  catatan: string | null;
  keranjang: string | PesananItem[];
  total_harga: number;
};
