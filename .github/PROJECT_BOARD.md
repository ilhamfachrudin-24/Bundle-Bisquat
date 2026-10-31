# 📊 GitHub Project Kanban Blueprint — SolBundler

Blueprint ini dirancang untuk struktur papan **GitHub Projects (v2)** untuk mengelola roadmap, sprint, fitur, dan pengujian token launch pada repositori SolBundler.

---

## 🏗️ 1. Kolom Status Standar (Kanban Columns)

| Status Kolom | Ikon | Deskripsi Alur Kerja |
|---|---|---|
| **📥 Backlog** | 📥 | Ide fitur baru, laporan bug masuk yang belum diverifikasi, dan usulan komunitas. |
| **📋 Todo / Sprint Ready** | 📋 | Tugas yang telah dianalisis dan siap untuk dikerjakan pada sprint aktif. |
| **⚙️ In Progress** | ⚙️ | Sedang dalam proses pengembangan kode (branch aktif). |
| **🧪 Testing & Devnet Review** | 🧪 | Sedang diuji di Solana Devnet / Localnet / PR Review. |
| **✅ Done** | ✅ | Telah di-merge ke branch `main`, di-deploy ke production, dan diverifikasi on-chain. |

---

## 🏷️ 2. Custom Fields (Bidang Kustom)

Buat custom fields berikut di menu **Settings ➜ Custom fields** pada Project Board Anda:

1. **Priority** (Single select):
   - 🔴 `P0 - Critical` (Blocker / Bug Keamanan)
   - 🟠 `P1 - High` (Fitur Inti / Jito MEV)
   - 🟡 `P2 - Medium` (Penyempurnaan UI & Bot Parameter)
   - 🟢 `P3 - Low` (Dokumentasi & Kosmetik)
2. **Module** (Single select):
   - `👛 Wallet-Catalog`
   - `🚀 Jito-MEV-Bundler`
   - `🤖 Volume-Bot`
   - `💸 OKX-Disperser`
   - `🔒 Security-Audit`
   - `🌐 Infrastructure-RPC`
3. **Language** (Single select):
   - `🦀 Rust`
   - `🐍 Python`
   - `⚡ TypeScript`
4. **Network** (Single select):
   - `Mainnet-Beta`
   - `Devnet`
   - `Localnet`

---

## 🎯 3. Daftar Kartu Tugas & Issues Siap Pakai (Seed Items)

Berikut adalah daftar tugas terstruktur yang dapat langsung ditambahkan ke board:

### 🚀 Sprint 1: Infrastruktur Wallet & Keamanan (Selesai / Done)
- [x] **[P0] [Wallet] Client-Side Ed25519 Cryptographic Generator**  
  *Deskripsi*: Buat generator massal keypair Solana di browser tanpa menyentuh server backend.  
  *Status*: `Done` | *Module*: `Wallet-Catalog` | *Language*: `TypeScript`
- [x] **[P0] [Security] Multi-layer Anti-Leak & Git Protection**  
  *Deskripsi*: Terapkan pemindai Gitleaks, proteksi `.env`, dan checklist keamanan PR.  
  *Status*: `Done` | *Module*: `Security-Audit`
- [x] **[P1] [RPC] Real-time Solana Balance Synchronization**  
  *Deskripsi*: Hubungkan RPC Solana ke seluruh wallet di catalog dengan interval polling otomatis 8 detik dan backup failover RPC.  
  *Status*: `Done` | *Module*: `Infrastructure-RPC`

### ⚡ Sprint 2: Jito MEV Bundler & Atomic Token Launch (Selesai / Done)
- [x] **[P0] [Jito] Rust On-Chain Bundling Program (`programs/solbundler`)**  
  *Deskripsi*: Tulis smart contract Solana native dalam bahasa Rust untuk dispersi atomik dan tip Jito di Slot 0.  
  *Status*: `Done` | *Module*: `Jito-MEV-Bundler` | *Language*: `Rust`
- [x] **[P1] [Jito] Rust High-Performance Searcher Client (`crates/jito-bundler`)**  
  *Deskripsi*: Bangun searcher engine Rust untuk merakit transaksi dan mengirim bundle langsung ke Jito Block Engine.  
  *Status*: `Done` | *Module*: `Jito-MEV-Bundler` | *Language*: `Rust`
- [x] **[P1] [Launcher] 4-Step Stealth Bundle Launch UI**  
  *Deskripsi*: Buat form wizard peluncuran token lengkap dengan pinning IPFS Pinata dan kalkulasi fee Jito.  
  *Status*: `Done` | *Module*: `Jito-MEV-Bundler` | *Language*: `TypeScript`

### 🤖 Sprint 3: Autonomous Volume Bot & CEX Funding (Aktif / In Progress)
- [x] **[P1] [Bot] 3-Phase Interactive Web Volume Bot**  
  *Deskripsi*: Implementasikan siklus trading Radar, Bear Trap, dan FOMO Breakout dengan visual telemetri real-time.  
  *Status*: `Done` | *Module*: `Volume-Bot` | *Language*: `TypeScript`
- [x] **[P1] [Bot] Python Autonomous Market Maker Script (`scripts/python/volume_bot.py`)**  
  *Deskripsi*: Buat skrip Python mandiri dengan delay acak (Gaussian jitter 3–15s) untuk VPS background bot.  
  *Status*: `Done` | *Module*: `Volume-Bot` | *Language*: `Python`
- [x] **[P1] [CEX] OKX API Stealth Disperser (`scripts/python/okx_stealth_disperser.py`)**  
  *Deskripsi*: Terapkan skrip Python penarikan SOL dari OKX dengan otentikasi HMAC SHA256.  
  *Status*: `Done` | *Module*: `OKX-Disperser` | *Language*: `Python`
- [ ] **[P2] [Bot] Telegram Alert Bot Integration**  
  *Deskripsi*: Kirim notifikasi real-time ke grup Telegram saat Volume Bot berganti fase atau mendeteksi volume pump besar.  
  *Status*: `Todo` | *Module*: `Volume-Bot` | *Language*: `Python`

### 🧪 Sprint 4: Pemeliharaan & Fitur Masa Depan (Backlog)
- [ ] **[P2] [DEX] Meteora DLMM Dynamic Pool Integration**  
  *Deskripsi*: Tambahkan opsi peluncuran liquiditas dinamis pada DEX Meteora DLMM selain Pump.fun dan Raydium.  
  *Status*: `Backlog` | *Module*: `Jito-MEV-Bundler`
- [ ] **[P3] [Analytics] PnL Historical Chart Export to CSV/PDF**  
  *Deskripsi*: Fitur ekspor laporan performa keuntungan dan pengeluaran gas fee proyek ke file PDF/CSV.  
  *Status*: `Backlog` | *Module*: `Wallet-Catalog`
