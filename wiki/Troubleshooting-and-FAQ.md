# 🛠️ FAQ & Penyelesaian Masalah (Troubleshooting)

Halaman ini merangkum pertanyaan umum dan solusi teknis terkait penggunaan SolBundler.

---

### Q1: Saldo wallet baru saya muncul 0 SOL. Bagaimana cara mengisinya?
**Jawaban**:
Saat keypair baru dibuat di *Wallet Catalog*, itu adalah dompet kriptografis resmi yang belum pernah menerima transaksi.
Anda dapat:
1. Menyalin Public Key wallet tersebut dan mengirimkan SOL dari wallet Phantom Anda atau dari exchange (Indodax, Tokocrypto, Binance, OKX).
2. Menggunakan skrip Python `scripts/python/okx_stealth_disperser.py` untuk mendistribusikan saldo dari OKX.
3. Setelah SOL terkirim, klik **"Sync Balances (Solana RPC)"** di aplikasi — saldo akan terupdate langsung dari blockchain.

---

### Q2: Mengapa RPC Solana publik terkadang lambat atau muncul pesan limit?
**Jawaban**:
Node RPC publik default Solana (`api.mainnet-beta.solana.com`) membatasi kueri hingga 40 request per 10 detik per IP.
SolBundler telah dilengkapi:
- Failover otomatis ke RPC sekunder Ankr (`https://rpc.ankr.com/solana`).
- Untuk peluncuran token live berskala besar, disarankan memasukkan endpoint RPC khusus berkecepatan tinggi dari [Helius](https://helius.dev) atau [QuickNode] ke dalam variable `SOLANA_RPC_ENDPOINT` atau `HELIUS_API_KEY`.

---

### Q3: Apakah ekstensi Phantom saya aman saat terhubung ke aplikasi?
**Jawaban**:
Ya, 100% aman. SolBundler menggunakan protokol standar Solana Wallet Adapter:
- Aplikasi hanya meminta izin untuk membaca Public Key dan saldo on-chain.
- Aplikasi **tidak pernah** memiliki akses ke private key atau recovery phrase dari ekstensi Phantom Anda.
- Setiap transaksi selalu meminta persetujuan konfirmasi eksplisit (*Sign Transaction*) di pop-up Phantom Anda.

---

### Q4: Bagaimana cara menghentikan Volume Bot di tengah jalan?
**Jawaban**:
- **Di Web App**: Klik tombol merah **"Hentikan Bot (Pause)"** di tab Volume Bot. Bot akan menyelesaikan transaksi aktif terakhir dan langsung berhenti.
- **Di Terminal Python**: Tekan kombinasi tombol `Ctrl + C`. Skrip akan menangkap sinyal `KeyboardInterrupt` dan berhenti secara aman (*graceful shutdown*).
