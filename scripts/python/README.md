# 🐍 Panduan SolBundler Python Automation Suite

Modul ini menyediakan skrip otomasi **Python** untuk menjalankan Volume Bot dan pendanaan stealth CEX OKX secara mandiri di server VPS atau komputer lokal Anda.

---

## 📦 Instalasi Dependensi
Jalankan di terminal:
```bash
cd scripts/python
pip install -r requirements.txt
```

---

## 🤖 1. Menjalankan Volume Bot (`volume_bot.py`)
Skrip ini menjalankan maker/volume generator otomatis dengan 3 fase natural (Radar Phase, Bear Trap, dan Sustained Volume) dilengkapi jitter delay acak untuk menghindari deteksi algoritma bot:

```bash
# Menjalankan volume bot standar
python volume_bot.py --token <MINT_ADDRESS_TOKEN_ANDA>

# Kustomisasi interval delay (3 sampai 8 detik) dan total siklus (100 transaksi)
python volume_bot.py --token <MINT_ADDRESS> --min-delay 3.0 --max-delay 8.0 --cycles 100
```

---

## 💸 2. Menjalankan OKX Stealth Disperser (`okx_stealth_disperser.py`)
Skrip ini mendistribusikan saldo SOL dari akun OKX Exchange Anda ke puluhan wallet stealth tanpa relasi on-chain:

```bash
# Jalankan mode simulasi / dry-run
python okx_stealth_disperser.py
```
*Pastikan telah mengisi `OKX_API_KEY`, `OKX_API_SECRET`, dan `OKX_PASSPHRASE` pada file `.env` jika ingin melakukan penarikan live.*
