# Changelog

Semua perubahan penting pada prototipe **Menu Pembayaran Info KHS (Versi PRD Only)** didokumentasikan di file ini.

## [1.2.0] - 2026-11-22
### Fixed
- Memastikan label jenis biaya (seperti "UTS" dan "UAS") tampil utuh pada panel ringkasan pembayaran (UI-05).
- Menonaktifkan tombol "Lanjut ke Pembayaran Bank" saat belum ada item tagihan yang dicentang (Total Rp0).

## [1.1.0] - 2026-11-22
### Added
- Menambahkan halaman/modal konfirmasi akhir yang menampilkan identitas mahasiswa (Nama, NIM, Jurusan) secara tebal di bagian atas (FR-05, UI-04).
- Menambahkan *state* transisi menuju portal bank sebagai batas akhir alur (*Out of Scope*).

## [1.0.0] - 2026-11-22
### Added
- Dokumen `PRD.md` sebagai acuan utama pengembangan.
- Struktur awal antarmuka daftar tagihan dengan fitur *checkbox multi-select* (FR-01) dan kalkulasi total *real-time* (FR-02).
- Penguncian kolom nominal (*read-only*) dan *badge* status "LUNAS" untuk tagihan bersisa Rp0 (FR-03, FR-04, UI-01, UI-02).