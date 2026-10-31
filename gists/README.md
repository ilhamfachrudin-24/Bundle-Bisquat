# 📜 SolBundler GitHub Gists Catalog

Koleksi skrip utilitas mandiri (*standalone snippets*) yang siap dipublikasikan ke akun **GitHub Gists** Anda (`https://gist.github.com/novi240397`).

---

## 📑 Daftar Gist yang Tersedia

| File Gist | Bahasa | Deskripsi & Kegunaan |
|---|:---:|---|
| **`01_solana_keypair_generator.py`** | 🐍 Python | Generator batch keypair Ed25519 Solana mandiri & ekspor Base58 Phantom. |
| **`02_jito_mev_tip_checker.py`** | 🐍 Python | Pengecek percentile tip Jito MEV real-time (25th, 50th, 75th, 95th, 99th) dari Jito Block Engine. |
| **`03_quick_volume_swap.py`** | 🐍 Python | Simulator micro-swap volume dengan delay acak Gaussian jitter (3–10s). |
| **`04_okx_v5_withdrawal_signer.py`** | 🐍 Python | Fungsi pembuatan tanda tangan HMAC SHA-256 untuk penarikan aset dari API OKX V5. |
| **`05_rust_solana_balance_checker.rs`** | 🦀 Rust | Pengecek saldo puluhan wallet Solana secara bersamaan (*concurrent*) via Tokio (<200ms). |
| **`06_docker_compose_vps.yml`** | 🐳 YAML | Konfigurasi Docker Compose siap pakai untuk hosting SolBundler & Volume Bot di VPS Linux. |

---

## 🚀 Cara Mempublikasikan ke GitHub Gists

### Cara 1: Otomatis via Script Python (Paling Praktis)
Jalankan skrip yang telah kami sediakan:
```bash
python3 scripts/publish_gists.py --token <GITHUB_PERSONAL_ACCESS_TOKEN>
```
*Skrip akan membaca seluruh file di folder `gists/` dan mempublikasikannya secara otomatis ke akun Gist Anda.*

---

### Cara 2: Menggunakan GitHub CLI (`gh`)
Jika Anda telah memasang `gh` CLI di komputer:
```bash
# Login ke GitHub
gh auth login

# Publikasikan masing-masing Gist:
gh gist create gists/01_solana_keypair_generator.py --desc "Solana Stealth Batch Keypair Generator (Ed25519)" --public
gh gist create gists/02_jito_mev_tip_checker.py --desc "Real-time Jito MEV Tip Floor Checker" --public
gh gist create gists/03_quick_volume_swap.py --desc "Solana Micro-Volume Swap Simulation with Jitter" --public
gh gist create gists/04_okx_v5_withdrawal_signer.py --desc "OKX V5 REST API HMAC SHA-256 Signer for Stealth Withdrawals" --public
gh gist create gists/05_rust_solana_balance_checker.rs --desc "Concurrent Solana Multi-Wallet Balance Checker in Rust" --public
gh gist create gists/06_docker_compose_vps.yml --desc "Docker Compose Deployment for SolBundler & Volume Bot" --public
```

---

### Cara 3: Melalui Browser Web
1. Buka [https://gist.github.com](https://gist.github.com).
2. Salin isi dari file `.py`, `.rs`, atau `.yml` di folder `gists/`.
3. Masukkan deskripsi Gist dan nama file.
4. Klik **Create public gist** (atau **secret gist**).
