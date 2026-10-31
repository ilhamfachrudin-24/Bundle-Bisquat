# 📚 Panduan Mempublikasikan Wiki ke GitHub

Seluruh file di dalam folder `/wiki/` ini telah diformat secara khusus untuk **GitHub Wiki**.

Terdapat dua cara mudah untuk mempublikasikannya ke tab **Wiki** repositori GitHub Anda:

---

### Cara 1: Menggunakan Git (Paling Cepat & Otomatis)

GitHub menyediakan repositori git terpisah khusus untuk Wiki. Jalankan langkah berikut di terminal:

```bash
# 1. Buka tab Wiki di browser pada repositori Anda sekali saja dan buat halaman pertama agar git wiki aktif.
# 2. Clone repositori Wiki repositori Anda:
git clone https://github.com/novi240397/SolBundler.wiki.git solbundler-wiki

# 3. Salin seluruh file .md dari folder wiki/ ke folder solbundler-wiki:
cp -r wiki/*.md solbundler-wiki/

# 4. Masuk ke folder wiki dan push ke GitHub:
cd solbundler-wiki
git add .
git commit -m "docs: populate comprehensive SolBundler GitHub Wiki"
git push origin master
```

---

### Cara 2: Salin Manual via Browser (Web Interface)

1. Buka repositori Anda di GitHub: `https://github.com/novi240397/SolBundler`.
2. Klik tab **Wiki** di menu atas.
3. Klik tombol hijau **Create the first page** (atau **New Page**).
4. Beri judul halaman sesuai nama file (misal: `Home`, `Quick-Start-Guide`, `Architecture-and-Tech-Stack`, `_Sidebar`, `_Footer`).
5. Salin isi file `.md` yang ada di folder ini ke editor GitHub Wiki dan klik **Save Page**.
