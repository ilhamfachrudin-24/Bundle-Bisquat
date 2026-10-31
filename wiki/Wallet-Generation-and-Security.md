# 👛 Manajemen Wallet & Keamanan Kriptografis

Keamanan aset dan privasi kunci rahasia adalah fondasi paling penting dalam SolBundler. Dokumen ini menjelaskan mekanisme teknis pembuatan keypair, penyimpanan data lokal, dan kebijakan anti-bocor.

---

## 🔑 Pembuatan Keypair Kriptografis Ed25519

Setiap wallet yang digenerate di SolBundler adalah **Solana Keypair nyata (Ed25519 standard curve)**:
- Dibuat menggunakan fungsi `Keypair.generate()` dari `@solana/web3.js` yang memanfaatkan *CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)* browser.
- Menghasilkan 32-byte seed dan 64-byte secret key yang kompatibel 100% dengan standar dompet Solana (Phantom, Solflare, Backpack, Solana CLI).

---

## 🔒 Penyimpanan Kunci di Sisi Klien (Non-Custodial)

1. **Browser LocalStorage Saja**: Kunci privat disimpan secara lokal pada browser pengguna (`localStorage`).
2. **Tidak Pernah Terkirim ke Server**:
   - Backend Next.js atau API proxy **tidak pernah menerima payload kunci privat**.
   - Server hanya menerima alamat kunci publik (`pubkey` Base58) untuk keperluan kueri saldo on-chain ke RPC node.
3. **Kemampuan Ekspor Mandiri**:
   - Pengguna dapat membuka modal *Keys* pada setiap baris wallet untuk melihat dan menyalin kunci privat dalam format Base58.
   - String Base58 ini dapat diimpor langsung ke aplikasi Phantom kapan saja:  
     *Settings ➜ Manage Accounts ➜ Add / Connect Wallet ➜ Import Private Key*.

---

## 🛡️ Kebijakan Anti-Bocor & Proteksi Repositori

Agar repositori Anda tidak pernah mengalami insiden kebocoran kredensial di GitHub:

1. **`.gitignore` Ketat**:
   - File `.env`, `.env.local`, `.env.production` otomatis diabaikan oleh Git.
   - Hanya file `.env.example` yang diizinkan untuk di-commit.
2. **Workflow Pemindai Gitleaks (`.github/workflows/security.yml`)**:
   - Setiap pull request atau push akan dipindai oleh bot Gitleaks untuk memastikan tidak ada private key atau API token yang terselip secara tidak sengaja.
3. **Fitur "Hapus Semua Wallet"**:
   - Tersedia tombol darurat di tampilan *Wallet Catalog* dan *Stealth Wallets* untuk menghapus seluruh jejak pool wallet dari `localStorage` browser dalam satu klik.
