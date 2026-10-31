# 🚀 SolBundler — Solana Stealth Bundle & Volume Bot Suite

> **Sistem Web3 Launch & Automated Volume Management Tingkat Produksi untuk Ekosistem Solana & Pump.fun**

SolBundler adalah platform Web3 modern yang dirancang khusus untuk memfasilitasi peluncuran token stealth (*stealth bundle launch*), pembuatan dan pengelolaan ratusan wallet terisolasi (*wallet catalog*), pendanaan otomatis (*CEX/OKX stealth funding*), serta bot pembuat volume (*automated volume bot*) dengan perlindungan privasi maksimal.

---

## 📑 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Keamanan & Privasi](#-arsitektur-keamanan--privasi-penting)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Panduan Instalasi Lokal](#-panduan-instalasi-lokal)
- [Konfigurasi Environment (.env)](#-konfigurasi-environment-variables)
- [Panduan Upload ke GitHub & Deployment](#-panduan-upload-ke-github--deploy)
- [Otomasi Deploy via GitHub Actions (CI/CD)](#-otomasi-deploy-via-github-actions-cicd)
- [Struktur Folder](#-struktur-folder-proyek)
- [Disclaimer & Risiko](#-disclaimer)

---

## ✨ Fitur Utama

### 1. 👛 Multi-Wallet Catalog & Batch Generator
- **Pembuatan Massal (Batch Generation)**: Generate puluhan hingga ratusan wallet Solana (ed25519 keypair) secara instan.
- **Penyimpanan Aman di Sisi Klien**: Kunci privat (private keys) dienkripsi dan disimpan secara lokal pada browser (`localStorage`), **tidak pernah dikirim ke server**.
- **Sinkronisasi Saldo Real-Time**: Terhubung langsung ke RPC Solana (Mainnet-Beta atau Devnet) untuk membaca saldo SOL secara real-time.
- **Manajemen Fleksibel**: Fitur hapus wallet individual (ikon tempat sampah), fitur **"Hapus Semua Wallet"**, serta ekspor data wallet (CSV / JSON format).

### 2. ⚡ Stealth Bundle Launcher (Anti-Sniper & Multi-Buy)
- Menyiapkan parameter peluncuran token (Name, Ticker, Description, Image/Metadata ke IPFS Pinata).
- Pembagian alokasi beli (*buy distribution*) terfragmentasi ke berbagai wallet stealth dalam 1 slot bundle atomik (Jito MEV bundle protection).
- Simulasi slippage dan fee tip Jito kustom guna memastikan transaksi masuk di blok pertama.

### 3. 🤖 Automated Volume & Maker Bot
- Menghasilkan volume transaksi organik secara terus-menerus.
- Pengaturan interval waktu acak (*randomized delay*) dan variasi ukuran transaksi (*micro-buy/sell*) untuk menghindari deteksi algoritma bot detector di DexScreener & Birdeye.
- Tombol darurat Stop/Pause untuk menghentikan loop transaksi sewaktu-waktu.

### 4. 💸 Stealth Funding & Balance Sweeper
- Integrasi API OKX untuk mendistribusikan modal SOL dari CEX secara otomatis ke seluruh wallet stealth tanpa jejak relasi on-chain antar wallet (*unlinked addresses*).
- Fitur **Balance Sweeper (1-Click Sweep)** untuk menarik kembali sisa saldo SOL dari semua wallet ke master wallet pengguna.

### 5. 🔗 Real-Time Wallet Connector
- Mendukung koneksi dompet Web3 populer: **Phantom, Solflare, Backpack, OKX Web3 Wallet**.
- Menampilkan status jaringan RPC aktif, latensi, dan public key connected wallet.

### 6. 📂 Manajemen Proyek & Arsip
- Dashboard overview aktivitas peluncuran token.
- Detail proyek dengan riwayat transaksi on-chain dan tanda tangan transaksi (Solana signature links).
- Fitur hapus proyek (*delete project*) dan arsip proyek (*archive*).

---

## 🔒 Arsitektur Keamanan & Privasi (PENTING)

Keamanan aset dan data sensitif pengguna adalah prioritas nomor 1 pada SolBundler:

1. **Aturan `.gitignore` Berlapis**:
   - Semua variasi file environment (`.env`, `.env.local`, `.env.production`, `.env*.local`) **secara otomatis diabaikan** oleh Git.
   - Kunci sertifikat (`*.pem`, `*.key`) dan cache build (`.next/`, `.vercel`) tidak akan pernah ter-push ke repository publik maupun privat GitHub.
   - Hanya file `.env.example` (berisi contoh variabel kosong tanpa data rahasia) yang diizinkan masuk ke repository.

2. **Kunci Privat (Private Keys) Tidak Pernah Menyentuh Server**:
   - Generator wallet berjalan 100% di browser pengguna via Web Crypto API dan `@solana/web3.js`.
   - Backend API hanya bertindak sebagai proxy aman untuk RPC query dan integrasi CEX bila dikonfigurasi.

---

## 🛠️ Arsitektur Multi-Bahasa Sesuai Kebutuhan Spesifik

Sistem ini dirancang dengan prinsip pemilihan bahasa pemrograman terbaik sesuai peruntukan (*the right tool for the job*):

1. **🦀 Rust — On-Chain Program & Ultra-Low Latency MEV Engine**:
   - `programs/solbundler/src/lib.rs`: Smart contract Solana native (Rust SBF) untuk dispersi dana atomik, sweep saldo, dan verifikasi Jito Tip dalam satu slot.
   - `crates/jito-bundler/src/main.rs`: Searcher client Rust multi-threaded berkecepatan tinggi (<10ms) untuk merakit dan mengirim bundle langsung ke Jito Block Engine.
2. **🐍 Python — Autonomous Volume Bot & CEX Disperser**:
   - `scripts/python/volume_bot.py`: Bot market maker otomatis dengan 3 fase natural, random delay (jitter 3–15 detik), dan simulasi swap anti-bot detector.
   - `scripts/python/okx_stealth_disperser.py`: Skrip pendanaan mandiri via API OKX dengan enkripsi HMAC SHA256.
3. **⚡ TypeScript / React 19 / Next.js 15 — Full-Stack Web3 Dashboard**:
   - Dashboard antarmuka pengguna interaktif, pembuat Solana keypair Ed25519 di browser, serta proxy RPC dengan backup otomatis.
   - Sinkronisasi saldo otomatis real-time setiap 8 detik dan saat fokus browser.

---

## 📋 Persyaratan Sistem

- **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan Node.js 20 LTS).
- **Package Manager**: `npm`, `yarn`, atau `bun`.

---

## 🚀 Panduan Instalasi Lokal

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME_ANDA/NAMA_REPO.git
cd NAMA_REPO
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Buat File Konfigurasi `.env.local`
Salin template dari `.env.example`:
```bash
cp .env.example .env.local
```

Buka file `.env.local` dengan text editor dan lengkapi nilai variabel sesuai kebutuhan Anda.

### 4. Jalankan Development Server
```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Konfigurasi Environment Variables

Berikut adalah daftar variabel yang ada di dalam file `.env.example`:

| Nama Variabel | Wajib? | Keterangan |
|---------------|:------:|------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Opsional | Pilihan jaringan (`mainnet-beta` atau `devnet`). Default: `mainnet-beta`. |
| `SOLANA_RPC_ENDPOINT` | Sangat Disarankan | RPC Solana berkecepatan tinggi (contoh: Helius, QuickNode, Alchemy, atau Triton). |
| `HELIUS_API_KEY` | Opsional | API key Helius untuk webhook, prioritised fees, dan Jito bundling. |
| `PINATA_JWT` | Opsional | Token JWT Pinata IPFS untuk upload gambar dan metadata token. |
| `PINATA_GATEWAY` | Opsional | Gateway URL Pinata (contoh: `https://gateway.pinata.cloud/ipfs/`). |
| `OKX_API_KEY` | Opsional | API key akun OKX jika ingin menggunakan fitur stealth auto-funding CEX. |
| `OKX_API_SECRET` | Opsional | API secret akun OKX. |
| `OKX_PASSPHRASE` | Opsional | Passphrase akun API OKX. |
| `GEMINI_API_KEY` | Opsional | API key Google Gemini untuk fitur asisten analisis token server-side. |

> 💡 **Catatan**: Jika hanya menggunakan fitur pembuatan wallet dan simulasi, Anda dapat langsung menjalankannya tanpa perlu mengisi semua API key eksternal di atas.

---

## 🚢 Panduan Upload ke GitHub & Deploy

### Langkah 1: Inisialisasi dan Push ke GitHub
Jalankan perintah berikut di terminal komputer Anda:

```bash
# 1. Pastikan status git bersih dan .env tidak tercantum
git init
git status

# 2. Tambahkan semua file yang tidak diabaikan git
git add .

# 3. Buat commit pertama
git commit -m "feat: initial commit SolBundler suite"

# 4. Hubungkan ke repository GitHub Anda (buat repository di GitHub terlebih dahulu)
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/solana-bundler-suite.git

# 5. Push ke GitHub
git push -u origin main
```

> 🛡️ **Pengecekan Keamanan**: Periksa repository Anda di GitHub. Pastikan **HANYA** file `.env.example` yang terlihat. File `.env` atau `.env.local` tidak akan pernah muncul di GitHub karena telah dilindungi oleh file `.gitignore`.

### Langkah 2: Deploy ke Vercel
1. Kunjungi [vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Klik **"Add New..."** ➜ **"Project"**.
3. Pilih repository GitHub Anda.
4. Pada bagian **Environment Variables**, masukkan variabel yang dibutuhkan (misal: `SOLANA_RPC_ENDPOINT`, `PINATA_JWT`, dll).
5. Klik **"Deploy"**.

### Langkah 3: Deploy ke Railway
Railway adalah platform cloud modern yang sangat cocok untuk aplikasi Next.js:
1. Buka [railway.com](https://railway.com) dan login dengan akun GitHub Anda.
2. Klik **"New Project"** ➜ **"Deploy from GitHub repo"**.
3. Pilih repository SolBundler Anda.
4. Railway otomatis membaca konfigurasi `railway.json` kami dan menjalankan build & start.
5. Buka tab **Variables** di Railway Dashboard dan tambahkan environment variable yang dibutuhkan (seperti `NEXT_PUBLIC_SOLANA_RPC_URL`, `SOLANA_RPC_ENDPOINT`).
6. Buka tab **Settings** ➜ **Networking** ➜ Klik **Generate Domain** untuk mendapatkan URL HTTPS publik.

---

## 🤖 Ekosistem GitHub Actions & GitHub Projects

Repository ini telah dilengkapi dengan 6 workflow GitHub Actions otomatis di folder `.github/workflows/`, Issue Templates interaktif, dan Pull Request Template:

| Workflow File | Fungsi & Pemicu |
|---|---|
| **`ci.yml`** | Menjalankan typecheck & build Next.js pada setiap `push` dan `pull_request`. |
| **`deploy-railway.yml`** | Otomasi deploy ke **Railway** via Railway CLI saat push ke branch `main`. |
| **`deploy.yml`** | Otomasi deploy ke **Vercel Production** saat push ke branch `main`. |
| **`security.yml`** | Memindai kebocoran kunci privat (*secret leaks* via Gitleaks), analisis keamanan kode (CodeQL SAST), dan audit dependensi npm. |
| **`project-automation.yml`** | Auto-labeling, triage selamat datang, dan otomatisasi kartu **GitHub Projects (Kanban)** untuk Issue & PR baru. |
| **`release.yml`** | Otomasi pembuatan GitHub Release, changelog, dan kompresi bundle saat push tag versi (`v*`). |

### 📋 Manajemen Issue & Template
- **🐛 Bug Report Template**: `.github/ISSUE_TEMPLATE/bug_report.yml`
- **✨ Feature Request Template**: `.github/ISSUE_TEMPLATE/feature_request.yml`
- **🚀 Token Launch Support**: `.github/ISSUE_TEMPLATE/token_launch_issue.yml`
- **📝 Pull Request Template**: `.github/pull_request_template.md` (dilengkapi Checklist Keamanan Solana).

> 📖 **Panduan Lengkap Setup Project Board & Secrets**: Silakan baca panduan lengkap di [**`GITHUB_SETUP.md`**](./GITHUB_SETUP.md) untuk langkah membuat Kanban Board, label warna, dan integrasi GitHub Project.

---

### 🔑 Menyiapkan GitHub Secrets untuk Deploy Otomatis

Buka repository GitHub Anda ➜ Pilih tab **Settings** ➜ **Secrets and variables** ➜ **Actions** ➜ Klik **New repository secret**:

#### A. Secrets untuk Deploy Railway (`deploy-railway.yml`)
| Nama Secret | Wajib? | Cara Mendapatkannya |
|-------------|:------:|---------------------|
| `RAILWAY_TOKEN` | **Wajib** | Buka [railway.com/account/tokens](https://railway.com/account/tokens) (atau Project Settings ➜ Tokens) ➜ Generate token baru ➜ Salin nilainya. |
| `RAILWAY_SERVICE_NAME` | Opsional | Nama service spesifik di project Railway Anda (jika memiliki lebih dari satu service). |

#### B. Secrets untuk Deploy Vercel (`deploy.yml`)
| Nama Secret | Wajib? | Cara Mendapatkannya |
|-------------|:------:|---------------------|
| `VERCEL_TOKEN` | **Wajib** | Buka [vercel.com/account/tokens](https://vercel.com/account/tokens) ➜ Klik Create Token. |
| `VERCEL_ORG_ID` | **Wajib** | Vercel Dashboard ➜ Settings ➜ General ➜ Team/User ID. |
| `VERCEL_PROJECT_ID` | **Wajib** | Vercel Project ➜ Settings ➜ General ➜ Project ID. |

#### C. Secrets untuk GitHub Project Automation (`project-automation.yml`)
| Nama Secret | Wajib? | Kegunaan |
|-------------|:------:|----------|
| `GH_PROJECT_URL` | Opsional | URL Project Board Anda (contoh: `https://github.com/users/username/projects/1`) |
| `ADD_TO_PROJECT_PAT` | Opsional | Personal Access Token dengan izin `project` untuk menghubungkan issue secara otomatis |


---

## 🛡️ Panduan Keamanan GitHub (Anti-Hack Protection)

Agar repository, akun GitHub, dan aset token Anda aman dari peretasan (*hack*), sistem ini dilengkapi perlindungan berlapis:

1. **Secret Scanning Otomatis (Gitleaks)**:
   - Workflow `security.yml` memindai riwayat commit & pull request untuk memastikan tidak ada kunci privat Solana (Base58 88-char), API token, atau secret CEX yang bocor ke publik.
2. **Analisis Keamanan Kode Statis (GitHub CodeQL SAST)**:
   - Memindai codebase secara otomatis untuk mencegah serangan injeksi, XSS, prototype pollution, dan celah eksekusi kode berbahaya.
3. **Pembaruan Kerentanan Dependensi (Dependabot)**:
   - File `.github/dependabot.yml` memantau semua paket npm dan GitHub Actions setiap minggu, serta otomatis membuka Pull Request patch jika ada celah CVE baru.
4. **Prinsip Hak Akses Terendah (Least-Privilege)**:
   - Semua workflow GitHub Actions hanya diberikan izin `contents: read` untuk mencegah eksploitasi runner hijacking.
5. **Checklist Keamanan Akun Anda**:
   - Aktifkan **Two-Factor Authentication (2FA)** di akun GitHub Anda.
   - Aktifkan **Branch Protection** pada branch `main` (wajibkan PR dan check lulus sebelum merge).
   - Jangan pernah menyimpan private key master wallet Anda di file proyek.
   - Baca panduan lengkap di [SECURITY.md](./SECURITY.md).

---

## 📁 Struktur Folder Proyek

```text
├── .github/
│   ├── dependabot.yml        # Dependabot automated dependency security scanner
│   └── workflows/
│       ├── ci.yml            # Automated CI build & test check on push/PR
│       ├── deploy.yml        # Automated production deployment to Vercel
│       ├── deploy-railway.yml# Automated deployment to Railway via Railway CLI
│       └── security.yml      # Gitleaks secret scanning & CodeQL SAST security analysis
├── app/                      # Next.js 15 App Router
│   ├── api/                  # Server-side API proxy routes (RPC, funding, pinata)
│   ├── layout.tsx            # Root layout & font configurations
│   ├── page.tsx              # Halaman utama aplikasi (view controller)
│   └── globals.css           # Styling Tailwind CSS
├── components/               # Komponen Modular UI
│   ├── Header.tsx            # Bar navigasi atas & status RPC
│   ├── Sidebar.tsx           # Navigasi tab (Overview, Launch, Wallets, Bot, dll)
│   ├── OverviewView.tsx      # Dashboard ringkasan proyek & metrik
│   ├── NewLaunchView.tsx     # Wizard pembuatan bundle launch & Jito config
│   ├── WalletCatalogView.tsx # Generator & manajemen wallet (hapus, ekspor, cek saldo)
│   ├── StealthWalletsView.tsx# Distribusi dana & penarikan saldo (sweeper)
│   ├── VolumeBotView.tsx     # Modul volume generator & auto-trade maker
│   ├── ProjectDetailView.tsx # Monitoring proyek aktif & log transaksi
│   ├── ArchivedView.tsx      # Arsip peluncuran terdahulu
│   ├── HowToUseView.tsx      # Panduan penggunaan lengkap dalam UI
│   └── PhantomConnectModal.tsx # Modal koneksi dompet Web3
├── lib/                      # Utilitas & helper functions
├── types/                    # Definisi TypeScript type & interface
├── .env.example              # Template variabel lingkungan (aman untuk publik)
├── .gitignore                # Daftar proteksi file rahasia & build
├── metadata.json             # Manifest metadata aplikasi
├── next.config.ts            # Konfigurasi Next.js
├── package.json              # Daftar pustaka & skrip eksekusi
├── railway.json              # Konfigurasi deployment Railway platform
├── SECURITY.md               # Kebijakan keamanan & panduan anti-hack
└── tsconfig.json             # Konfigurasi TypeScript
```

---

## ⚠️ Disclaimer

- Perangkat lunak ini disediakan **apa adanya (as-is)** untuk tujuan edukasi, pengujian ekosistem Solana, dan pengelolaan likuiditas internal.
- Segala bentuk interaksi on-chain dengan dana riil (SOL) melibatkan risiko finansial pada blockchain. Pastikan Anda menguji alur di **Solana Devnet** terlebih dahulu sebelum mengeksekusi transaksi pada **Mainnet-Beta**.
- Selalu simpan cadangan (*backup*) kunci privat wallet Anda di tempat yang aman sebelum melakukan pembersihan cache browser.

---

**Dikembangkan untuk komunitas Web3 Solana yang mengutamakan kecepatan, efisiensi, dan privasi.**
