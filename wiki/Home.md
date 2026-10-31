# 🚀 Selamat Datang di Wiki SolBundler

> **Dokumentasi Resmi & Panduan Teknis Komprehensif SolBundler: Solana Stealth Bundle & Autonomous Volume Bot Suite**

SolBundler adalah platform Web3 modern yang dirancang khusus untuk memfasilitasi peluncuran token stealth (*stealth bundle launch*), pembuatan dan pengelolaan ratusan wallet terisolasi (*wallet catalog*), pendanaan otomatis (*CEX/OKX stealth funding*), serta bot pembuat volume (*automated volume bot*) dengan perlindungan privasi maksimal di ekosistem Solana dan Pump.fun.

---

## 📑 Topik Utama Wiki

1. **[Panduan Memulai Cepat (Quick Start Guide)](Quick-Start-Guide)**  
   Langkah demi langkah dari instalasi lokal, menghubungkan Phantom wallet, hingga melakukan simulasi bundle pertama.

2. **[Arsitektur & Tech Stack Multi-Bahasa](Architecture-and-Tech-Stack)**  
   Penjelasan peranan program on-chain **Rust (SBF)** untuk transaksi atomik, skrip otomasi **Python** untuk market maker, dan antarmuka **Next.js 15 / TypeScript**.

3. **[Manajemen Wallet & Keamanan Kriptografis](Wallet-Generation-and-Security)**  
   Bagaimana kunci privat Ed25519 dibuat di sisi browser pengguna, dienkripsi secara lokal, dan tidak pernah terkirim ke server backend.

4. **[Jito MEV Bundler & Anti-Snipe Protection](Jito-MEV-and-Stealth-Bundling)**  
   Mekanisme pengelompokan transaksi dalam 1 slot atomik (Slot 0), estimasi tip Jito MEV, dan mitigasi serangan MEV sandwich.

5. **[Strategi Volume Bot (3-Phase Maker Engine)](Volume-Bot-Strategy-Guide)**  
   Alur strategi pembentukan volume organik: *Radar Initiation*, *Bear Trap Dip*, dan *FOMO Breakout* dengan variasi delay acak (jitter 3–15 detik).

6. **[Integrasi CEX OKX & Balance Sweeper](OKX-CEX-Funding-Integration)**  
   Cara mendistribusikan modal SOL dari bursa OKX tanpa jejak on-chain dan menarik kembali sisa dana secara otomatis ke master wallet.

7. **[FAQ & Panduan Penyelesaian Masalah (Troubleshooting)](Troubleshooting-and-FAQ)**  
   Solusi galat umum: rate limit RPC publik, CORS, slippage error, dan deployment cloud.

---

## 🛡️ Prinsip Keamanan Utama SolBundler
- **Zero Custody**: Server backend tidak pernah menyimpan, membaca, atau menerima kunci privat pengguna.
- **Client-Side Cryptography**: Keypair Solana di-generate murni menggunakan pustaka Web Crypto dan `@solana/web3.js` di browser Anda.
- **Strict Anti-Leak**: File `.env` dan rahasia sensitif otomatis dicegah terkirim ke GitHub melalui aturan `.gitignore` berlapis dan pemindai Gitleaks.
