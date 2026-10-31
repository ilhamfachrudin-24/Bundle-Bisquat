# 🏗️ Arsitektur & Teknologi Multi-Bahasa

SolBundler dibangun di atas prinsip arsitektur terisolasi di mana setiap bahasa pemrograman digunakan untuk tugas yang paling unggul di bidangnya:

```
+-------------------------------------------------------------------------+
|                  SolBundler Web Application (Next.js 15)                |
|           React 19 • Tailwind CSS v4 • Solana Web3.js • Lucide          |
+--------------------+--------------------------------+-------------------+
                     |                                |
     (On-Chain / Ultra Low Latency)       (Autonomous Telemetry / Cron)
                     v                                v
+------------------------------------+  +---------------------------------+
|      🦀 Rust Solana Engine         |  |      🐍 Python Bot Suite        |
|  - programs/solbundler/ (SBF)      |  |  - scripts/python/volume_bot.py |
|  - crates/jito-bundler/ (Searcher) |  |  - scripts/python/okx_disp.py   |
|  - Atomic Bundle & Slot 0 Tip      |  |  - Jitter Delays & Market Maker |
+------------------------------------+  +---------------------------------+
```

---

## 1. 🦀 Rust — On-Chain Smart Contract & High-Performance Searcher

Di ekosistem Solana, performa tingkat mikrodetik mutlak diperlukan untuk memenangkan *landing block* pertama (Slot 0). Bahasa **Rust** digunakan pada modul berikut:

### A. Solana Native Program (`programs/solbundler/src/lib.rs`)
Smart contract Solana native (SBF) yang dikompilasi dengan `cargo build-sbf`:
- **`DisperseSol`**: Mengirimkan SOL dari master wallet ke puluhan wallet stealth dalam 1 transaksi atomik tanpa meninggalkan histori transfer bertahap yang mudah dilacak bot analitik on-chain.
- **`SweepSol`**: Mengumpulkan kembali sisa modal SOL dari seluruh wallet stealth ke alamat tujuan penarikan pengguna.
- **`PayJitoTip`**: Mentransfer tip langsung ke validator Jito terpilih untuk memprioritaskan bundle di blok berikutnya.

### B. Jito MEV Searcher Client (`crates/jito-bundler/src/main.rs`)
Program Rust mandiri berbasis `tokio` dan `reqwest` yang berinteraksi langsung dengan Jito Block Engine via JSON-RPC endpoint:
- Serialisasi transaksi bincode dan Base58 encoding.
- Merakit hingga 5 transaksi sekaligus dalam satu bundle atomik.
- Menjamin transaksi dieksekusi secara *all-or-nothing* (jika satu gagal, seluruh bundle dibatalkan).

---

## 2. 🐍 Python — Autonomous Volume Maker & CEX Disperser

Bahasa **Python** unggul dalam scripting analitis, pembuatan delay probabilistik (jitter), dan integrasi API perbankan/bursa kripto:

### A. Volume Bot CLI (`scripts/python/volume_bot.py`)
- Skrip independen yang bisa dijalankan di background VPS atau cron job.
- Menggunakan pustaka `solders` dan `solana-py`.
- Algoritma Gaussian Jitter untuk mendistribusikan waktu swap secara acak (3 hingga 15 detik), menghindari pengenalan pola oleh sistem anti-bot DexScreener.

### B. OKX Stealth Disperser (`scripts/python/okx_stealth_disperser.py`)
- Menggunakan tanda tangan kriptografis HMAC SHA-256 untuk mengakses endpoint penarikan bursa OKX (`/api/v5/asset/withdrawal`).
- Mengatur jeda penarikan antar wallet secara acak agar bursa tidak mengelompokkan penarikan sebagai aktivitas *sybil*.

---

## 3. ⚡ TypeScript / Next.js 15 — Full-Stack Interface

- **React 19 & Next.js 15 App Router**: Antarmuka dashboard responsif dengan render server-side dan client components terisolasi.
- **Solana Web3.js**: Mengelola koneksi RPC Solana, pendeteksian provider Phantom/Solflare di browser, serta perhitungan fee.
- **API Proxy Internal (`/api/solana/balance`)**: Mengarahkan kueri saldo melalui server proxy internal untuk menghindari pemblokiran CORS browser dan menyediakan failover ke RPC cadangan saat RPC publik mengalami limit.
