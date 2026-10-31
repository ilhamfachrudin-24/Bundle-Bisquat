# 💸 Integrasi CEX OKX & Balance Sweeper

Salah satu kesalahan paling umum saat meluncurkan token secara stealth adalah mendistribusikan modal SOL dari satu master wallet langsung ke seluruh sub-wallet on-chain. Platform seperti Bubblemaps dapat mendeteksi kluster wallet tersebut hanya dalam beberapa detik.

SolBundler memecahkan masalah ini dengan **CEX Stealth Funding via OKX API**.

---

## 🏦 Mengapa Menggunakan Penarikan dari CEX?

Saat Anda menarik SOL dari bursa terpusat (seperti OKX atau Binance) ke sub-wallet:
1. Alamat pengirim di blockchain adalah **Hot Wallet bursa** (misalnya alamat OKX Hot Wallet yang melayani jutaan pengguna).
2. **Tidak ada tautan on-chain langsung** antara master wallet Anda dengan sub-wallet stealth Anda.
3. Di Bubblemaps, setiap sub-wallet akan terlihat sebagai investor independen yang membeli token secara terpisah.

---

## ⚙️ Cara Mengonfigurasi API OKX

1. Masuk ke akun [OKX](https://www.okx.com/) Anda.
2. Buka menu profil ➜ **API Keys** ➜ **Create V5 API Key**.
3. Beri izin (*Permissions*): **Read** dan **Withdraw** (Penarikan).
4. Catat `API Key`, `API Secret`, dan `Passphrase`.
5. Masukkan ke file `.env.local` atau Environment Variables server:
   ```env
   OKX_API_KEY=your_okx_api_key_here
   OKX_API_SECRET=your_okx_api_secret_here
   OKX_PASSPHRASE=your_okx_passphrase_here
   ```

---

## 🧹 Fitur Balance Sweeper (1-Click Sweep)

Setelah peluncuran token selesai atau bot volume telah dihentikan:
- Di menu **"Stealth Wallets"**, masukkan alamat tujuan penarikan (*master receiver pubkey*).
- Klik tombol **"Sweep All Stealth Wallets"**.
- Sistem akan mengeksekusi penarikan kembali sisa saldo SOL dari seluruh sub-wallet ke dompet utama Anda secara otomatis.
