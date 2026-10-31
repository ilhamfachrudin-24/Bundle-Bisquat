# 🛡️ Security Policy & Hardening Guidelines

## 1. Kebijakan Keamanan (Security Policy)

Keamanan aset kripto, kunci privat (*private keys*), dan data pengguna adalah prioritas mutlak dalam proyek SolBundler. Dokumen ini menjelaskan standar keamanan yang diterapkan serta langkah-langkah untuk mencegah eksploitasi atau kebocoran kredensial (*anti-hack*).

---

## 2. Pelaporan Kerentanan (Reporting a Vulnerability)

Jika Anda menemukan kerentanan keamanan (*security vulnerability*) dalam proyek ini:

1. **JANGAN membuka isu publik (Do NOT open a public GitHub issue).**
2. Gunakan fitur **GitHub Private Vulnerability Reporting**:
   - Buka tab **Security** di repository GitHub ini.
   - Klik **Report a vulnerability**.
   - Berikan deskripsi detail mengenai celah keamanan dan langkah reproduksi (*proof of concept*).
3. Kami akan meninjau laporan dalam waktu maksimal **24–48 jam** dan merilis perbaikan sebelum informasi dipublikasikan.

---

## 3. Arsitektur Pertahanan & Perlindungan Kunci Privat

### A. Kunci Privat Solana (Ed25519 Keypairs)
- **Zero-Knowledge di Server**: Seluruh generator wallet berjalan 100% di browser pengguna melalui Web Crypto API. Private key tidak pernah dikirimkan atau disimpan di backend server.
- **Penyimpanan Lokal**: Kunci disimpan di `localStorage` peramban pengguna. Selalu pastikan komputer Anda bebas dari ekstensi browser yang mencurigakan (malware keylogger).
- **Hapus Wallet Setelah Digunakan**: Gunakan fitur **"Hapus Semua Wallet"** setelah proses peluncuran token selesai untuk mengosongkan session browser.

### B. Proteksi File `.env` & Rahasia API
- File konfigurasi lokal (`.env`, `.env.local`, `.env.production`) **telah diabaikan secara ketat di `.gitignore`**.
- Jangan pernah menjalankan `git add -f .env` atau memaksa memasukkan file kredensial ke Git.
- Hanya file `.env.example` dengan nilai dummy yang diizinkan berada di repository.

---

## 4. Fitur Keamanan GitHub yang Diaktifkan (Anti-Hack Measures)

Repository ini telah dikonfigurasi dengan beberapa lapisan proteksi otomatis:

| Lapisan Keamanan | Alat / Workflow | Fungsi |
|------------------|-----------------|--------|
| **Secret Scanning** | Gitleaks (`security.yml`) | Mencegah dan mendeteksi kunci privat Solana (Base58), API key CEX, atau token deploy ter-commit ke git. |
| **SAST Code Analysis** | GitHub CodeQL (`security.yml`) | Menganalisis kode JavaScript/TypeScript untuk mendeteksi celah keamanan (XSS, Prototype Pollution, Injeksi). |
| **Dependency Scanning** | Dependabot (`dependabot.yml`) | Memindai paket npm secara berkala dan membuat Pull Request otomatis saat ditemukan CVE pada pustaka pihak ketiga. |
| **NPM Audit** | `npm audit` check | Memastikan dependensi tidak memiliki kerentanan tingkat High atau Critical. |
| **Least-Privilege Token** | GitHub Actions Permissions | Workflow CI/CD dibatasi hanya dengan hak baca (`contents: read`) guna mencegah serangan *runner hijacking*. |

---

## 5. Rekomendasi Pengaturan Akun GitHub Anda (Pencegahan Peretasan)

Untuk memastikan repository dan akun GitHub Anda tidak bisa diretas:

1. **Wajibkan Two-Factor Authentication (2FA)**:
   - Aktifkan 2FA di [GitHub Settings ➜ Password and authentication](https://github.com/settings/security) menggunakan aplikasi autentikator (Google Authenticator / 1Password) atau Security Key fisik (YubiKey).

2. **Aktifkan Branch Protection pada Branch `main`**:
   - Buka repository ➜ **Settings** ➜ **Branches** ➜ **Add branch protection rule**.
   - Masukkan branch pattern: `main`.
   - Centang opsi:
     - `Require a pull request before merging`
     - `Require status checks to pass before merging` (pilih `CI - Build & Type Check` dan `CodeQL Security Analysis`).
     - `Do not allow bypassing the above settings`.

3. **Gunakan GitHub Repository Secrets**:
   - Simpan semua token deploy (`RAILWAY_TOKEN`, `VERCEL_TOKEN`, dll) hanya di **Settings ➜ Secrets and variables ➜ Actions**. Token yang disimpan di sini terenkripsi dan tidak akan pernah ditampilkan kembali dalam bentuk teks polos.

4. **Waspadai Phishing & Ekstensi Browser Palsu**:
   - Jangan pernah memasukkan seed phrase atau private key master wallet Anda ke formulir mana pun di luar aplikasi resmi dompet Web3 (Phantom, Solflare).
