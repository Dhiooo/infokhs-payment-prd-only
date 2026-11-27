# PRODUCT REQUIREMENT DOCUMENT (PRD)
**Proyek:** Multi-Selection & Checkout Menu Pembayaran Info KHS UMM (Versi PRD Only)  
**Nama Mahasiswa:** Mochammad Eriza Anwar  
**NIM:** 202310370311197  
**Tanggal Analisis:** 27 November 2026  
**Live Deployment (Vercel):** [https://infokhs-payment-prd-only-fylu.vercel.app/](https://infokhs-payment-prd-only-fylu.vercel.app/)  
**Live Deployment (GitHub Pages):** [https://dhiooo.github.io/infokhs-payment-prd-only/](https://dhiooo.github.io/infokhs-payment-prd-only/)

---

## 1. PRODUCT OVERVIEW
Fitur Multi-Selection & Checkout Menu Pembayaran Info KHS UMM dirancang untuk menyederhanakan proses pembayaran tagihan (SPP/DPP) mahasiswa. Produk ini memungkinkan pengguna memilih beberapa item tagihan sekaligus dan memvalidasi total pembayaran dalam satu alur yang terintegrasi, mengurangi kebutuhan untuk input manual yang berulang.

## 2. PROBLEM STATEMENT
Mahasiswa (pengguna) merasa cemas, lelah, dan was-was saat melunasi tagihan Info KHS karena alur seleksi yang tidak efisien (*scroll & reload loop*), input nominal yang bebas diedit manual (rawan salah ketik), ambiguitas penulisan jenis biaya, dan ketiadaan validasi identitas sebelum dialihkan ke portal bank.

## 3. TARGET USERS, STAKEHOLDER & USER NEEDS
### 3.1 Primary User
Mahasiswa aktif Universitas Muhammadiyah Malang (UMM) lintas fakultas yang melakukan pembayaran tagihan SPP dan DPP secara mandiri melalui Info KHS.

### 3.2 User Persona
* **Riki (21 Tahun, Mahasiswa Aktif):** Ingin membayar tagihan semester secara cepat dan aman tanpa takut salah sasaran transfer. Sangat berhati-hati dan selalu mengecek ulang rincian tagihan karena tidak percaya pada antarmuka sistem saat ini.

### 3.3 User Needs
* **UN-01:** Kepastian bahwa nominal yang dibayarkan sudah valid dan akurat tanpa harus mengetik angka secara manual.
* **UN-02:** Kemudahan memilih beberapa item tagihan (SPP & DPP) sekaligus secara instan tanpa proses *page reload*.
* **UN-03:** Transparansi rincian nama tagihan utuh dan validasi identitas (Nama & NIM) untuk menghindari salah transfer.
* **UN-04:** Indikator visual yang jelas secara sekilas untuk membedakan antara tagihan yang belum dibayar dengan yang sudah lunas.

### 3.4 Stakeholder
1. Biro Keuangan UMM (Memastikan penerimaan dana sesuai tagihan).
2. Tim IT/Pengembang Info KHS (Mengelola sistem dan integrasi).

## 4. PRODUCT GOALS
1. Menurunkan tingkat kecemasan pengguna (*User Anxiety*) saat transaksi.
2. Mempercepat durasi penyelesaian pembayaran (*time-to-task*).
3. Mengurangi angka *human error* pada input nominal tagihan hingga 0%.

## 5. PRODUCT SCOPE
### 5.1 In Scope
Perombakan antarmuka menu Keuangan > Pembayaran pada Info KHS, termasuk tabel daftar tagihan, logika pemilihan item (*checkbox*), kalkulasi dinamis, dan halaman ringkasan/konfirmasi akhir.

### 5.2 Out of Scope
Desain antarmuka portal pembayaran bank pihak ketiga (*Payment Gateway*, *Virtual Account*, atau *M-Banking*).

## 6. FUNCTIONAL REQUIREMENTS
* **FR-01:** Sistem menyediakan elemen *Checkbox* pada setiap baris tagihan yang sisa kekurangannya > Rp0.
* **FR-02:** Sistem mengalkulasi total tagihan secara *asynchronous* (*real-time* tanpa *page reload*) setiap kali *checkbox* dicentang.
* **FR-03:** Sistem mengunci (*lock*) nilai nominal pembayaran berdasarkan *database* (tidak dapat diedit manual).
* **FR-04:** Sistem menyembunyikan fungsi "Bayar" atau *Checkbox* jika tagihan memiliki nilai kekurangan Rp0.
* **FR-05:** Sistem menarik (GET) dan menampilkan data identitas mahasiswa (Nama, NIM, Jurusan) pada halaman/modal ringkasan akhir sebelum integrasi bank.

## 7. UX REQUIREMENTS
* **UI-01:** Kolom nominal berada pada *state disabled/read-only* dengan warna latar visual abu-abu terang.
* **UI-02:** Tagihan lunas (Rp0) memiliki *badge* "LUNAS" berwarna hijau kontras, dan baris tabel diredupkan (*dimmed*).
* **UI-03:** Panel ringkasan mengambang (*sticky*) agar pengguna selalu melihat total harga saat men-*scroll* tabel utama.
* **UI-04:** Nama dan NIM mahasiswa di halaman konfirmasi akhir ditampilkan dengan *font* tebal (Bold) di bagian paling atas.
* **UI-05:** Label jenis biaya (contoh: "UTS", "HER") ditampilkan utuh dan tidak terpotong di semua panel.

## 8. USER STORIES
* As a mahasiswa, I want to memilih beberapa tagihan sekaligus menggunakan *checkbox*, so that saya tidak perlu menunggu *reload* dan *scroll* berulang kali.
* As a mahasiswa, I want to melihat nominal tagihan terkunci secara otomatis, so that saya tidak cemas akan melakukan kesalahan ketik (*human error*).
* As a mahasiswa, I want to melihat label warna "LUNAS" pada tagihan bersisa Rp0, so that saya tidak bingung membedakannya dengan tagihan aktif.
* As a mahasiswa, I want to melihat validasi identitas (Nama, NIM) sebelum dialihkan ke bank, so that saya yakin 100% tagihan dibayarkan ke akun saya sendiri.
* As a mahasiswa, I want to melihat rincian nama tagihan yang konsisten dan utuh, so that saya tidak ragu terhadap jenis biaya yang sedang dibayar.

## 9. ACCEPTANCE CRITERIAS
* **AC-01:** Pengguna dapat mencentang lebih dari satu tagihan dan melihat total harga ter-*update* seketika.
* **AC-02:** Pengguna tidak dapat mengklik, mengedit, atau menghapus angka nominal pada tagihan aktif.
* **AC-03:** Baris tagihan dengan kekurangan Rp0 dipastikan tidak memiliki elemen interaktif (*checkbox*/tombol bayar) yang aktif.
* **AC-04:** Layar konfirmasi akhir sukses menampilkan rincian Nama, NIM, dan daftar tagihan secara akurat sebelum pengguna menekan tombol lanjut ke bank.

---

## 10. ARSITEKTUR KODE & CARA MENJALANKAN
* `index.html` — Struktur halaman utama dan modal konfirmasi.
* `css/styles.css` — Konfigurasi gaya kustom dan *state* visual elemen terkunci.
* `js/data/mockBillingData.js` — Data simulasi tagihan semester mahasiswa UMM.
* `js/utils/formatter.js` — Fungsi pemformatan mata uang IDR dan simulasi pengambilan data.
* `js/components/` — Modul komponen antarmuka (`billingTable.js`, `summaryBar.js`, `confirmModal.js`).
* `js/app.js` — Pengelola *state* aplikasi dan *event listeners*.
* `docs/ACCEPTANCE_TEST.md` — Checklist hasil pengujian *Acceptance Criteria*.
