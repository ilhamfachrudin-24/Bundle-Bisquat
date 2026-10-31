## 📋 Ringkasan Perubahan (Summary)
<!-- Jelaskan secara ringkas perubahan apa saja yang dibuat dalam PR ini. -->

## 🔗 Terkait Issue (Related Issues)
Fixes #<!-- nomor issue -->

## 🛠️ Jenis Perubahan (Type of Change)
- [ ] 🐛 Bug fix (perbaikan error/masalah)
- [ ] ✨ New feature (fitur baru)
- [ ] ⚡ Performance optimization (optimasi kecepatan/latency RPC)
- [ ] 🔒 Security hardening (peningkatan keamanan wallet/kunci)
- [ ] 📚 Documentation update (pembaruan README / panduan)
- [ ] 🎨 UI/UX styling & responsiveness

## 🛡️ Checklist Keamanan Solana (Solana Security Checklist)
- [ ] **Tidak ada Private Key / Seed Phrase** yang di-hardcode ke dalam kode.
- [ ] Semua variable rahasia (RPC URL berbayar, Jito Keypair, API Secret) menggunakan `.env` / environment variables.
- [ ] Transaksi dan instruksi Solana divalidasi sebelum di-broadcast.
- [ ] Fee tip Jito memiliki limit batas atas (maksimal tip limit) untuk mencegah overpayment.

## 🧪 Pengujian (Testing)
- [ ] `npm run lint` berjalan sukses tanpa error.
- [ ] `npm run build` berhasil dikompilasi.
- [ ] Telah diuji pada Solana Devnet atau Localnet.

## 📸 Tangkapan Layar / Screenshot (Opsional)
<!-- Tambahkan screenshot jika ada perubahan pada antarmuka pengguna (UI) -->
