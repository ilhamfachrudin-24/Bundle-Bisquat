# ⚡ Panduan Memulai Cepat (Quick Start Guide)

Panduan ini akan membimbing Anda mulai dari inisialisasi lingkungan hingga menjalankan simulasi stealth bundle launch pertama Anda dalam waktu kurang dari 5 menit.

---

## 📋 Langkah 1: Persiapan Lingkungan

Pastikan komputer atau VPS Anda memiliki:
- **Node.js**: Versi 18.18+ atau 20 LTS (Disarankan)
- **Git**: Terpasang dan terkonfigurasi
- **Web Browser**: Chrome, Brave, atau Edge dengan ekstensi Phantom / Solflare terpasang.

Clone dan pasang dependensi:
```bash
git clone https://github.com/novi240397/SolBundler.git
cd SolBundler
npm install
```

Salin file konfigurasi environment:
```bash
cp .env.example .env.local
```
*(File `.env.local` bersifat lokal di komputer Anda dan aman dari git commit).*

Jalankan server pengembangan:
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000`.

---

## 👛 Langkah 2: Hubungkan Wallet Anda

1. Klik tombol **"Connect Wallet"** di pojok kanan atas Header.
2. Pilih ekstensi yang Anda gunakan: **Phantom**, **Solflare**, atau **Backpack**.
3. Jika ekstensi tidak terpasang atau berjalan di mode sandbox, gunakan tab **"Input Manual Public Key"** untuk memasukkan alamat publik Anda secara langsung.
4. Perhatikan bahwa saldo SOL Anda akan otomatis tersinkronisasi secara real-time via koneksi Solana RPC.

---

## 🔑 Langkah 3: Generate Stealth Wallet Pool

1. Buka menu **"Wallet Catalog"** pada sidebar kiri.
2. Masukkan jumlah wallet yang ingin dibuat (contoh: `10` wallets) dan total alokasi SOL yang diinginkan.
3. Klik tombol hijau **"Generate Real Solana Wallets"**.
4. Sistem akan membuat keypair kriptografis resmi Solana Ed25519.
5. Anda dapat melihat kunci publik, melihat di Solscan, mengekspor kunci privat dalam format Base58 untuk diimpor ke Phantom kapan saja, atau menghapus seluruh wallet jika sudah selesai.

---

## 🚀 Langkah 4: Buat Peluncuran Token (New Launch)

1. Buka menu **"New Launch"** pada sidebar kiri.
2. **Tab 1 — Metadata Token**: Masukkan Nama Token (contoh: `SOL CAT`), Simbol (`SCAT`), dan Deskripsi.
3. **Tab 2 — Sosial**: Masukkan link Website, Twitter/X, dan Telegram komunitas Anda.
4. **Tab 3 — IPFS Pinning**: Unggah logo token ke IPFS via Pinata.
5. **Tab 4 — Bundle & Launch**:
   - Tentukan alokasi SOL untuk dev buy.
   - Tentukan alokasi SOL untuk setiap wallet stealth.
   - Masukkan Jito MEV Tip (disarankan minimal `0.01 SOL` untuk slot 0 priority).
   - Klik **"Deploy Stealth Bundle"**.

---

## 🤖 Langkah 5: Aktifkan Volume Bot

1. Buka menu **"Volume Bot"** pada sidebar kiri.
2. Verifikasi Token Mint Address yang ingin dibuatkan volume.
3. Pilih wallet stealth yang akan berpartisipasi (otomatis terpilih 5 wallet secara default).
4. Klik **"Mulai Volume Bot Sekarang"**.
5. Amati live telemetri di panel kanan: fase akan berganti secara otomatis dari *Radar Phase* &rarr; *Bear Trap Dip* &rarr; *FOMO Breakout* dengan variasi volume dan delay alami (anti-bot detector).
