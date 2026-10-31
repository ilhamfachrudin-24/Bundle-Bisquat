# 🤖 Strategi Volume Bot (3-Phase Maker Engine)

Volume trading adalah metrik utama yang digunakan oleh platform analitik seperti DexScreener, Birdeye, dan GeckoTerminal untuk menempatkan token pada daftar **"Trending"**.

SolBundler mengimplementasikan strategi market-making alami 3 fase (*3-Phase Strategy*) yang meniru pola transaksi organik trader manusia.

---

## 📈 Alur 3-Fase Alami

```
  Volume / Harga
      ^
      |                 /\  (Phase 3: FOMO Breakout)
      |                /  \
      |      /\       /    \
      |     /  \_____/      \  (Phase 2: Bear Trap Dip)
      |    /
      |---/ (Phase 1: Radar)
      +---------------------------------------------> Waktu (Time)
```

### Fase 1: Radar Initiation
- **Tujuan**: Memicu deteksi algoritma trending dan volume bot scanner.
- **Karakteristik**: 3 sampai 5 transaksi pembelian mikro berturut-turut (ukuran: `0.02 – 0.08 SOL`).
- **Interval**: Cepat (`3 – 6 detik`).

### Fase 2: Bear Trap Dip
- **Tujuan**: Menghilangkan kecurigaan bahwa token hanya dibeli oleh bot developer (*one-way buy*).
- **Karakteristik**: Melakukan penjualan mikro sekitar 40%–60% dari posisi wallet stealth untuk membuat lilin koreksi (*healthy pullback*) pada chart.
- **Interval**: Jeda lebih panjang (`10 – 20 detik`).

### Fase 3: FOMO Breakout
- **Tujuan**: Menggerakkan volume tinggi dengan rasio beli banding jual 4:1.
- **Karakteristik**: Transaksi acak dengan ukuran bervariasi (`0.05 – 0.20 SOL`) dari berbagai wallet stealth berbeda.
- **Interval**: Menggunakan algoritma acak *Gaussian Jitter* (`3 – 12 detik`).

---

## 🛡️ Fitur Anti-Bot Detection (Jitter & Fragmentation)
- **Gaussian Jitter Delay**: Bot tidak pernah menembak transaksi dalam jeda waktu yang sama persis (misal: bukan tepat setiap 5 detik), melainkan berfluktuasi acak antara 3.2 detik, 7.8 detik, 4.1 detik, dst.
- **Rotasi Wallet**: Transaksi dilakukan bergantian menggunakan puluhan public key berbeda dari pool wallet catalog, sehingga DexScreener membaca transaksi tersebut berasal dari banyak pembeli unik (*unique buyers*).
