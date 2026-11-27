# Changelog

Semua perubahan penting pada prototipe **Menu Pembayaran Info KHS (Versi PRD Only)** didokumentasikan di file ini.

## [1.3.1] - 2026-11-27
### Added
- Menambahkan tautan *live deployment* produksi pada server Vercel (`https://infokhs-payment-prd-only-fylu.vercel.app/`) di `README.md`.

## [1.3.0] - 2026-11-27
### Changed
- Memindahkan seluruh dokumen PRD ke dalam `README.md` utama repository sesuai ketentuan pengumpulan.
- Melakukan *refactoring* arsitektur kode dari satu berkas monolitik menjadi struktur modular (`css/`, `js/data/`, `js/utils/`, dan `js/components/`).

### Added
- Menambahkan dokumentasi pengujian `docs/ACCEPTANCE_TEST.md` untuk memverifikasi seluruh *Acceptance Criteria* (`AC-01` s/d `AC-04`).

## [1.2.0] - 2026-11-22
### Fixed
- Memastikan label jenis biaya (seperti "UTS" dan "UAS") tampil utuh pada panel ringkasan pembayaran (`UI-05`).
- Menonaktifkan tombol "Lanjut ke Pembayaran Bank" saat belum ada item tagihan yang dicentang (Total Rp0).

## [1.1.0] - 2026-11-22
### Added
- Menambahkan halaman/modal konfirmasi akhir yang menampilkan identitas mahasiswa (Nama, NIM, Jurusan) secara tebal di bagian atas (`FR-05`, `UI-04`).
- Menambahkan *state* transisi menuju portal bank sebagai batas akhir alur (*Out of Scope*).

## [1.0.0] - 2026-11-22
### Added
- Dokumen spesifikasi PRD sebagai acuan utama pengembangan.
- Struktur awal antarmuka daftar tagihan dengan fitur *checkbox multi-select* (`FR-01`) dan kalkulasi total *real-time* (`FR-02`).
- Penguncian kolom nominal (*read-only*) dan *badge* status "LUNAS" untuk tagihan bersisa Rp0 (`FR-03`, `FR-04`, `UI-01`, `UI-02`).
