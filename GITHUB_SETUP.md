# 🚀 Panduan Konfigurasi GitHub Actions & GitHub Projects — SolBundler

Dokumen ini menjelaskan cara menyetel dan memanfaatkan seluruh ekosistem **GitHub Actions** dan **GitHub Projects** yang telah dikonfigurasi untuk repository **SolBundler**.

---

## 📑 Daftar Isi
1. [Struktur GitHub Actions yang Tersedia](#1-struktur-github-actions-yang-tersedia)
2. [Konfigurasi GitHub Secrets & Environment Variables](#2-konfigurasi-github-secrets--environment-variables)
3. [Panduan Membuat & Menghubungkan GitHub Project (Kanban)](#3-panduan-membuat--menghubungkan-github-project-kanban)
4. [Daftar Label Standar Repository](#4-daftar-label-standar-repository)
5. [Template Issue & Pull Request](#5-template-issue--pull-request)
6. [Best Practices Proteksi Branch & Anti-Hack](#6-best-practices-proteksi-branch--anti-hack)

---

## 1. Struktur GitHub Actions yang Tersedia

Di dalam folder `.github/workflows/`, telah disediakan workflow otomatis:

| Workflow File | Trigger | Fungsi / Peran |
|---|---|---|
| `ci.yml` | Push & PR ke branch `main`, `master`, `dev` | Memeriksa build Next.js dan validasi tipe TypeScript agar tidak ada kode rusak yang masuk |
| `deploy-railway.yml` | Push ke `main` / Manual dispatch | Mengompilasi dan mendeploy aplikasi otomatis ke **Railway** via Railway CLI |
| `deploy.yml` | Push ke `main` / Manual dispatch | Mengompilasi dan mendeploy aplikasi otomatis ke **Vercel** via Vercel CLI |
| `security.yml` | Push, PR, dan terjadwal setiap Senin | Memindai rahasia bocor via **Gitleaks**, analisis kode mendalam via **GitHub CodeQL**, dan audit kerentanan `npm audit` |
| `project-automation.yml` | Setiap ada Issue atau PR baru | Memberi label otomatis (triage, bug, feature), memberi komentar sambutan aman, dan memasukkan kartu ke GitHub Project |
| `release.yml` | Saat membuat git tag versi (contoh: `v1.0.0`) | Membuat rilis resmi di GitHub Releases dengan file tarball build & changelog otomatis |

---

## 2. Konfigurasi GitHub Secrets & Environment Variables

Agar workflow deployment dan integrasi otomatis berjalan tanpa hambatan, masukkan secret berikut di GitHub:

### Langkah Menambahkan Secret di GitHub:
1. Masuk ke repository GitHub Anda: `https://github.com/novi240397/SolBundler`
2. Klik tab **Settings** (di sebelah kanan atas repository).
3. Di menu sebelah kiri, pilih **Secrets and variables** ➡️ **Actions**.
4. Klik tombol hijau **New repository secret**.

### Daftar Secret yang Direkomendasikan:

#### A. Untuk Deployment Railway:
- `RAILWAY_TOKEN`: Token API Railway Anda (dapatkan dari Dashboard Railway ➡️ Account Settings ➡️ Tokens).
- `RAILWAY_SERVICE_NAME`: *(Opsional)* Nama service di project Railway Anda (misalnya `solbundler-web`).

#### B. Untuk Deployment Vercel (Jika menggunakan Vercel):
- `VERCEL_TOKEN`: Token API Vercel dari akun Anda.
- `VERCEL_ORG_ID`: Team/Org ID dari project Vercel.
- `VERCEL_PROJECT_ID`: Project ID dari Vercel.

#### C. Untuk Otomasi GitHub Project:
- `GH_PROJECT_URL`: URL GitHub Project Anda (contoh: `https://github.com/users/novi240397/projects/1`).
- `ADD_TO_PROJECT_PAT`: Personal Access Token GitHub dengan scope `project` (agar workflow bisa menambahkan issue baru otomatis ke project board).

#### D. Variabel Solana RPC (Opsional tapi Direkomendasikan):
- `NEXT_PUBLIC_SOLANA_RPC_URL`: URL RPC Solana cepat Anda (misalnya dari Helius atau Quicknode).
- `NEXT_PUBLIC_CLUSTER`: `mainnet-beta` atau `devnet`.

---

## 3. Panduan Membuat & Menghubungkan GitHub Project (Kanban)

Untuk mengelola roadmap, bug, tugas, dan fitur SolBundler dengan visual Kanban:

### Cara Membuat GitHub Project:
1. Di profil GitHub Anda atau di tab repository, klik menu **Projects**.
2. Klik tombol **New project**.
3. Pilih template **Board** (Kanban).
4. Beri nama: `SolBundler Roadmap & Sprint`.
5. Buat kolom status standar:
   - 📥 **Backlog / Triage**: Ide baru dan issue masuk dari pengguna.
   - 📋 **Todo / Ready**: Tugas yang telah diverifikasi dan siap dikerjakan.
   - ⚙️ **In Progress**: Sedang dalam proses pengembangan kode.
   - 🧪 **Testing & Review**: Sedang diuji di Solana Devnet / review PR.
   - ✅ **Done**: Selesai dan telah dideploy ke production.

### Menghubungkan Project ke Repository:
1. Di halaman Project Board, klik menu **...** (pojok kanan atas) ➡️ **Settings**.
2. Pada bagian **Linked repositories**, klik **Link a repository** dan pilih `SolBundler`.
3. Salin URL project tersebut ke Secret `GH_PROJECT_URL` repository Anda!

---

## 4. Daftar Label Standar Repository

Di tab **Issues** ➡️ **Labels**, pastikan label berikut aktif:

| Label | Warna | Kegunaan |
|---|---|---|
| `bug` | `#d73a4a` (Merah) | Masalah teknis atau galat sistem |
| `enhancement` | `#a2eeef` (Biru muda) | Ide atau fitur baru |
| `launch-support` | `#ff7b00` (Oranye) | Masalah bundling token & Jito tip |
| `security` | `#000000` (Hitam) | Terkait keamanan wallet & enkripsi |
| `triage` | `#fbca04` (Kuning) | Issue baru yang belum ditinjau |
| `needs-review` | `#0e8a16` (Hijau) | PR yang menunggu review kode |

---

## 5. Template Issue & Pull Request

Repository ini telah dilengkapi dengan formulir interaktif di `.github/ISSUE_TEMPLATE/`:
- **🐛 Laporan Bug**: Memiliki dropdown modul, pemilihan network (Mainnet/Devnet), formulir reproduksi, dan validasi anti-bocor private key.
- **✨ Usulan Fitur Baru**: Form usulan strategi volume, DEX baru (Meteora, Raydium), dan Jito tip optimizer.
- **🚀 Bantuan Token Launch**: Khusus pertanyaan bundling dev buy & parameter bonding curve.
- **Pull Request Template**: Otomatis menampilkan checklist keamanan Solana dan instruksi verifikasi build.

---

## 6. Best Practices Proteksi Branch & Anti-Hack

Agar repositori Anda tidak bisa di-tamper atau terkena insiden:

1. **Aktifkan Branch Protection pada `main`**:
   - Masuk ke **Settings** ➡️ **Branches** ➡️ **Add branch protection rule**.
   - Masukkan Branch name pattern: `main`.
   - Centang **Require a pull request before merging**.
   - Centang **Require status checks to pass before merging** dan pilih check:
     - `Build & Validate (CI - Build & Type Check)`
     - `CodeQL Security Analysis`
2. **Aktifkan Secret Scanning & Push Protection**:
   - Masuk ke **Settings** ➡️ **Code security and analysis**.
   - Pastikan **GitHub Advanced Security**, **Secret scanning**, dan **Push protection** berada pada status **Enabled**.
   - Push Protection akan otomatis menolak git commit jika mendeteksi Solana private key atau token rahasia secara tidak sengaja.
