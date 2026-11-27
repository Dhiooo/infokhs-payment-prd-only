# Acceptance Criteria Verification Checklist

Dokumen ini mencatat hasil pengujian fungsional prototipe **Info KHS Payment (PRD Only)** terhadap spesifikasi Bab 9 pada PRD.

| ID | Kriteria Penerimaan (Acceptance Criteria) | Skenario Pengujian | Status |
| :--- | :--- | :--- | :---: |
| **AC-01** | Pengguna dapat mencentang lebih dari satu tagihan dan melihat total harga ter-*update* seketika. | Mencentang item `SPP Semester 7 - UTS` dan `DPP`, total pada *sticky bar* langsung berubah menjadi `Rp 5.250.000` tanpa *reload*. | ✅ Lulus |
| **AC-02** | Pengguna tidak dapat mengklik, mengedit, atau menghapus angka nominal pada tagihan aktif. | Mengarahkan kursor dan mencoba mengetik pada kolom nominal; kolom terkunci (`disabled readonly`) dengan ikon gembok. | ✅ Lulus |
| **AC-03** | Baris tagihan dengan kekurangan Rp0 dipastikan tidak memiliki elemen interaktif aktif. | Memeriksa baris tagihan semester 5 & 6; *checkbox* tidak dirender, baris diredupkan (*dimmed*), dan tampil *badge* `LUNAS`. | ✅ Lulus |
| **AC-04** | Layar konfirmasi akhir menampilkan rincian Nama, NIM, dan daftar tagihan akurat sebelum lanjut ke bank. | Mengklik tombol `Lanjut Konfirmasi`; modal menampilkan Nama & NIM tebal di posisi teratas beserta rincian tagihan utuh. | ✅ Lulus |
