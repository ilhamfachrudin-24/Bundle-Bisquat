# 🚀 Jito MEV Bundler & Anti-Snipe Protection

Peluncuran token di Solana (terutama pada bonding curve Pump.fun atau Raydium AMM) sangat rentan terhadap serangan bot sniper dan bot sandwich MEV. SolBundler memanfaatkan jaringan validator **Jito MEV Block Engine** untuk mengatasi masalah ini secara tuntas.

---

## 🎯 Mengapa Membutuhkan Jito MEV Bundle?

Saat transaksi dikirimkan melalui RPC mempool standar:
1. Bot sniper membaca transaksi penciptaan token sebelum dimasukkan ke blok.
2. Bot sniper membayar priority fee lebih tinggi untuk membeli token sebelum wallet developer.
3. Developer atau partisipan ritel terpaksa membeli di harga puncak (*front-runned*).

Dengan **Jito Bundle**:
- Transaksi penciptaan token + transaksi pembelian developer + transaksi pembelian oleh seluruh wallet stealth dikelompokkan menjadi **satu paket bundle atomik**.
- Paket bundle dikirimkan langsung ke validator Jito via jalur privat tanpa melalui mempool publik.
- Seluruh transaksi dieksekusi secara berurutan dalam **Slot 0** (blok pertama) tanpa ada transaksi orang lain yang bisa menyela di tengah.

---

## 💰 Strategi Jito MEV Tip

Jito Block Engine mengharuskan salah satu instruksi dalam bundle membayar tip ke akun validator resmi Jito:

| Akun Jito Tip Resmi (Mainnet-Beta) |
|---|
| `96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5` |
| `HFqU5x63VTxvQssQn138i2674eCwznWVafjstYGiCY4Z` |
| `Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY` |
| `ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49` |
| `DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh` |
| `ADuUkR4vqLUMWXxW9gh6D6L8pWyssDxBpBpDxR8CVPj9` |
| `DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL` |
| `3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT` |

### Rekomendasi Besaran Tip:
- **Peluncuran Standar / Santai**: `0.005 SOL – 0.01 SOL`
- **Peluncuran Kompetitif (High Volume)**: `0.02 SOL – 0.05 SOL`
- **Peluncuran Hyped / Target Trending #1**: `0.10 SOL+`
