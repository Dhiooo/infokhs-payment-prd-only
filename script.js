/**
 * Info KHS UMM — Multi-Selection & Checkout Pembayaran Tagihan
 * Implementasi berbasis PRD (FR-01 s/d FR-05, UI-01 s/d UI-05, AC-01 s/d AC-04)
 */

// 1. Data Dummy Mahasiswa UMM & Daftar Tagihan Semester
const MOCK_DATABASE = {
  student: {
    nama: 'Riki Pratama',
    nim: '202310370311001',
    jurusan: 'Informatika',
    fakultas: 'Fakultas Teknik'
  },
  bills: [
    {
      id: 'BILL-20251-SPP',
      periode: '2025/2026 Ganjil (Sem 5)',
      jenisBiaya: 'SPP Semester 5 - UTS & UAS',
      totalTagihan: 4500000,
      terbayar: 4500000,
      sisaKekurangan: 0
    },
    {
      id: 'BILL-20251-PRK',
      periode: '2025/2026 Ganjil (Sem 5)',
      jenisBiaya: 'Praktikum Pemrograman Web (Semester 5)',
      totalTagihan: 350000,
      terbayar: 350000,
      sisaKekurangan: 0
    },
    {
      id: 'BILL-20252-SPP',
      periode: '2025/2026 Genap (Sem 6)',
      jenisBiaya: 'SPP Semester 6 - UTS & UAS',
      totalTagihan: 4500000,
      terbayar: 4500000,
      sisaKekurangan: 0
    },
    {
      id: 'BILL-20252-HER',
      periode: '2025/2026 Genap (Sem 6)',
      jenisBiaya: 'HER / Ujian Perbaikan Basis Data (Semester 6)',
      totalTagihan: 150000,
      terbayar: 150000,
      sisaKekurangan: 0
    },
    {
      id: 'BILL-20261-SPP-UTS',
      periode: '2026/2027 Ganjil (Sem 7)',
      jenisBiaya: 'SPP Semester 7 - UTS',
      totalTagihan: 2250000,
      terbayar: 0,
      sisaKekurangan: 2250000
    },
    {
      id: 'BILL-20261-SPP-UAS',
      periode: '2026/2027 Ganjil (Sem 7)',
      jenisBiaya: 'SPP Semester 7 - UAS',
      totalTagihan: 2250000,
      terbayar: 0,
      sisaKekurangan: 2250000
    },
    {
      id: 'BILL-20261-DPP',
      periode: '2026/2027 Ganjil (Sem 7)',
      jenisBiaya: 'DPP (Dana Pengembangan Pendidikan) - Angsuran 4',
      totalTagihan: 3000000,
      terbayar: 0,
      sisaKekurangan: 3000000
    },
    {
      id: 'BILL-20261-PRK-PKPL',
      periode: '2026/2027 Ganjil (Sem 7)',
      jenisBiaya: 'Praktikum Penjaminan Kualitas Perangkat Lunak (Semester 7)',
      totalTagihan: 300000,
      terbayar: 0,
      sisaKekurangan: 300000
    }
  ]
};

// 2. State Aplikasi
const state = {
  student: null,
  bills: [],
  selectedBillIds: new Set(),
  currentFilter: 'all' // 'all' | 'unpaid' | 'paid'
};

// 3. Utilitas Format Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// 4. Simulasi Penarikan Data (GET) Identitas & Tagihan dari Server Biro Keuangan UMM (FR-05)
function fetchStudentBillingData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(structuredClone(MOCK_DATABASE));
    }, 120);
  });
}

// 5. Render Identitas Mahasiswa & Ringkasan Atas
function renderStudentProfile() {
  const { nama, nim, jurusan, fakultas } = state.student;

  document.getElementById('nav-student-name').textContent = nama;
  document.getElementById('nav-student-nim').textContent = nim;

  document.getElementById('card-student-name').textContent = nama;
  document.getElementById('card-student-nim').textContent = nim;
  document.getElementById('card-student-major').textContent = `${jurusan} (${fakultas})`;

  const totalUnpaid = state.bills
    .filter((bill) => bill.sisaKekurangan > 0)
    .reduce((sum, bill) => sum + bill.sisaKekurangan, 0);

  const paidCount = state.bills.filter((bill) => bill.sisaKekurangan === 0).length;

  document.getElementById('summary-total-unpaid').textContent = formatRupiah(totalUnpaid);
  document.getElementById('summary-paid-count').textContent = `${paidCount} Item`;
}

// 6. Render Tabel Daftar Tagihan
function renderBillsTable() {
  const tbody = document.getElementById('bills-table-body');
  tbody.innerHTML = '';

  const filteredBills = state.bills.filter((bill) => {
    if (state.currentFilter === 'unpaid') return bill.sisaKekurangan > 0;
    if (state.currentFilter === 'paid') return bill.sisaKekurangan === 0;
    return true;
  });

  if (filteredBills.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-sm text-slate-500">
          Tidak ada data tagihan pada kategori filter ini.
        </td>
      </tr>
    `;
    updateSelectAllCheckboxState();
    return;
  }

  filteredBills.forEach((bill) => {
    const isPaid = bill.sisaKekurangan === 0;
    const isSelected = state.selectedBillIds.has(bill.id);

    const tr = document.createElement('tr');
    tr.dataset.billId = bill.id;

    // UI-02: Baris tagihan lunas (Rp 0) diredupkan (dimmed)
    if (isPaid) {
      tr.className = 'bg-slate-50/90 text-slate-400 opacity-70 select-none';
    } else {
      tr.className = isSelected
        ? 'bg-red-50/60 hover:bg-red-50 transition cursor-pointer'
        : 'bg-white hover:bg-slate-50 transition cursor-pointer';
    }

    // FR-01 & FR-04 & AC-03: Checkbox HANYA dirender pada baris dengan sisa > Rp 0.
    // Baris lunas (Rp 0) dipastikan tidak memiliki elemen interaktif aktif sama sekali.
    const checkboxCellHtml = isPaid
      ? `<span class="inline-block text-slate-300 text-xs font-medium" aria-hidden="true">—</span>`
      : `<input
          type="checkbox"
          class="bill-checkbox w-4 h-4 rounded border-slate-300 text-umm-maroon focus:ring-umm-maroon cursor-pointer"
          data-id="${bill.id}"
          aria-label="Pilih tagihan ${bill.jenisBiaya}"
          ${isSelected ? 'checked' : ''}
        />`;

    // FR-03, UI-01, AC-02: Kolom nominal berada pada state disabled/read-only dengan latar abu-abu terang
    // serta tidak dapat diklik, diedit, atau dihapus oleh pengguna.
    const lockedNominalHtml = `
      <div class="inline-flex items-center justify-end gap-1.5 w-full">
        <div class="relative inline-flex items-center">
          <span class="absolute left-2.5 text-slate-400 pointer-events-none" title="Nominal terkunci dari database">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            type="text"
            value="${formatRupiah(bill.sisaKekurangan)}"
            disabled
            readonly
            tabindex="-1"
            aria-label="Nominal sisa kekurangan ${bill.jenisBiaya} terkunci"
            class="w-40 sm:w-44 pl-7 pr-3 py-1.5 text-right font-mono text-xs sm:text-sm font-bold rounded-lg border border-slate-200 bg-gray-100 text-slate-700 cursor-not-allowed pointer-events-none select-none"
          />
        </div>
      </div>
    `;

    // UI-02: Badge "LUNAS" berwarna hijau kontras pada tagihan Rp 0
    const statusBadgeHtml = isPaid
      ? `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide bg-emerald-600 text-white shadow-xs">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          LUNAS
        </span>`
      : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          BELUM LUNAS
        </span>`;

    // UI-05: Label jenis biaya ditampilkan utuh (whitespace-normal break-words) tanpa terpotong
    tr.innerHTML = `
      <td class="py-3.5 pl-5 pr-3 text-center align-middle">
        ${checkboxCellHtml}
      </td>
      <td class="py-3.5 px-3 text-xs font-medium ${isPaid ? 'text-slate-400' : 'text-slate-600'} whitespace-normal break-words">
        ${bill.periode}
      </td>
      <td class="py-3.5 px-3 font-semibold ${isPaid ? 'text-slate-500' : 'text-slate-900'} whitespace-normal break-words leading-snug">
        ${bill.jenisBiaya}
      </td>
      <td class="py-3.5 px-3 text-right font-mono text-xs sm:text-sm ${isPaid ? 'text-slate-400' : 'text-slate-600'}">
        ${formatRupiah(bill.totalTagihan)}
      </td>
      <td class="py-3.5 px-3 text-right font-mono text-xs sm:text-sm ${isPaid ? 'text-slate-400' : 'text-slate-600'}">
        ${formatRupiah(bill.terbayar)}
      </td>
      <td class="py-3.5 px-3 text-right">
        ${lockedNominalHtml}
      </td>
      <td class="py-3.5 pl-3 pr-5 text-center align-middle">
        ${statusBadgeHtml}
      </td>
    `;

    // Klik pada baris tagihan aktif akan men-toggle pilihan checkbox secara nyaman
    if (!isPaid) {
      tr.addEventListener('click', (event) => {
        if (event.target.classList.contains('bill-checkbox')) return;
        toggleBillSelection(bill.id);
      });

      const checkbox = tr.querySelector('.bill-checkbox');
      checkbox.addEventListener('change', (event) => {
        toggleBillSelection(bill.id, event.target.checked);
      });
    }

    tbody.appendChild(tr);
  });

  updateSelectAllCheckboxState();
}

// 7. Logika Multi-Selection & Kalkulasi Real-Time (FR-02, AC-01)
function toggleBillSelection(billId, forceState) {
  const targetBill = state.bills.find((b) => b.id === billId);
  if (!targetBill || targetBill.sisaKekurangan <= 0) return;

  const shouldSelect =
    typeof forceState === 'boolean' ? forceState : !state.selectedBillIds.has(billId);

  if (shouldSelect) {
    state.selectedBillIds.add(billId);
  } else {
    state.selectedBillIds.delete(billId);
  }

  renderBillsTable();
  updateCheckoutSummary();
}

function updateSelectAllCheckboxState() {
  const selectAllEl = document.getElementById('select-all-checkbox');
  const activeBills = state.bills.filter((b) => b.sisaKekurangan > 0);

  if (activeBills.length === 0) {
    selectAllEl.checked = false;
    selectAllEl.indeterminate = false;
    selectAllEl.disabled = true;
    return;
  }

  selectAllEl.disabled = false;
  const selectedActiveCount = activeBills.filter((b) => state.selectedBillIds.has(b.id)).length;

  if (selectedActiveCount === 0) {
    selectAllEl.checked = false;
    selectAllEl.indeterminate = false;
  } else if (selectedActiveCount === activeBills.length) {
    selectAllEl.checked = true;
    selectAllEl.indeterminate = false;
  } else {
    selectAllEl.checked = false;
    selectAllEl.indeterminate = true;
  }
}

function getSelectedBills() {
  return state.bills.filter((bill) => state.selectedBillIds.has(bill.id) && bill.sisaKekurangan > 0);
}

// 8. Update Sticky Checkout Panel secara Real-Time (UI-03, UI-05, FR-02, AC-01)
function updateCheckoutSummary() {
  const selectedBills = getSelectedBills();
  const totalAmount = selectedBills.reduce((sum, bill) => sum + bill.sisaKekurangan, 0);

  const countBadge = document.getElementById('selected-count-badge');
  const previewContainer = document.getElementById('selected-items-preview');
  const totalAmountEl = document.getElementById('sticky-total-amount');
  const proceedBtn = document.getElementById('proceed-checkout-btn');
  const clearBtn = document.getElementById('clear-selection-btn');

  countBadge.textContent = `${selectedBills.length} Tagihan`;
  totalAmountEl.textContent = formatRupiah(totalAmount);

  if (selectedBills.length === 0) {
    previewContainer.textContent =
      'Belum ada tagihan yang dipilih. Silakan centang tagihan aktif pada tabel di atas.';
    previewContainer.className =
      'mt-1 text-xs sm:text-sm text-slate-500 whitespace-normal break-words leading-relaxed';
    proceedBtn.disabled = true;
    clearBtn.classList.add('hidden');
  } else {
    // UI-05: Tampilkan seluruh nama jenis biaya secara utuh dan tidak terpotong
    previewContainer.innerHTML = selectedBills
      .map(
        (bill) =>
          `<span class="inline-block bg-slate-100 border border-slate-200 text-slate-800 font-medium text-xs px-2.5 py-1 rounded-md mr-1.5 mb-1 whitespace-normal break-words">${bill.jenisBiaya} (${formatRupiah(bill.sisaKekurangan)})</span>`
      )
      .join('');
    proceedBtn.disabled = false;
    clearBtn.classList.remove('hidden');
  }
}

// 9. Modal Konfirmasi Akhir (FR-05, UI-04, UI-05, AC-04)
function openConfirmationModal() {
  const selectedBills = getSelectedBills();
  if (selectedBills.length === 0) return;

  // FR-05 & UI-04: Tampilkan Nama dan NIM dengan font Tebal (Bold) di bagian paling atas modal
  document.getElementById('modal-student-name').textContent = state.student.nama;
  document.getElementById('modal-student-nim').textContent = state.student.nim;
  document.getElementById('modal-student-major').textContent = `${state.student.jurusan} — ${state.student.fakultas}`;

  // AC-04 & UI-05: Daftar tagihan utuh dan akurat
  const listEl = document.getElementById('modal-selected-list');
  listEl.innerHTML = selectedBills
    .map(
      (bill, index) => `
      <li class="px-4 py-3 flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <span class="text-[11px] font-semibold text-slate-500 block">${index + 1}. ${bill.periode}</span>
          <span class="text-sm font-bold text-slate-900 whitespace-normal break-words leading-snug block mt-0.5">
            ${bill.jenisBiaya}
          </span>
        </div>
        <span class="font-mono text-sm font-bold text-slate-900 shrink-0 pt-1">
          ${formatRupiah(bill.sisaKekurangan)}
        </span>
      </li>
    `
    )
    .join('');

  const grandTotal = selectedBills.reduce((sum, bill) => sum + bill.sisaKekurangan, 0);
  document.getElementById('modal-grand-total').textContent = formatRupiah(grandTotal);

  const verifyCheckbox = document.getElementById('verify-identity-checkbox');
  const confirmBankBtn = document.getElementById('confirm-bank-btn');
  verifyCheckbox.checked = false;
  confirmBankBtn.disabled = true;

  const modal = document.getElementById('confirmation-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function handleProceedToBank() {
  const selectedBills = getSelectedBills();
  if (selectedBills.length === 0) return;

  const grandTotal = selectedBills.reduce((sum, bill) => sum + bill.sisaKekurangan, 0);
  const billNames = selectedBills.map((b) => b.jenisBiaya).join(', ');

  closeConfirmationModal();

  const banner = document.getElementById('bank-redirect-banner');
  const summaryText = document.getElementById('bank-redirect-summary');
  summaryText.innerHTML = `
    Atas nama <strong>${state.student.nama}</strong> (NIM: <strong class="font-mono">${state.student.nim}</strong>) untuk <strong>${selectedBills.length} item tagihan</strong> (${billNames}) dengan total nominal terkunci <strong>${formatRupiah(grandTotal)}</strong>.
  `;
  banner.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 10. Inisialisasi Event Listeners & Muat Data Awal
async function initApp() {
  const data = await fetchStudentBillingData();
  state.student = data.student;
  state.bills = data.bills;

  renderStudentProfile();
  renderBillsTable();
  updateCheckoutSummary();

  // Select All Checkbox (hanya memilih tagihan dengan sisa > Rp 0)
  document.getElementById('select-all-checkbox').addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    state.bills.forEach((bill) => {
      if (bill.sisaKekurangan > 0) {
        if (isChecked) {
          state.selectedBillIds.add(bill.id);
        } else {
          state.selectedBillIds.delete(bill.id);
        }
      }
    });
    renderBillsTable();
    updateCheckoutSummary();
  });

  // Filter Buttons
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((b) => {
        b.className =
          'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition';
      });
      btn.className =
        'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-umm-maroon text-white transition';
      renderBillsTable();
    });
  });

  // Tombol Batalkan Pilihan
  document.getElementById('clear-selection-btn').addEventListener('click', () => {
    state.selectedBillIds.clear();
    renderBillsTable();
    updateCheckoutSummary();
  });

  // Tombol Lanjut Konfirmasi pada Sticky Bar
  document.getElementById('proceed-checkout-btn').addEventListener('click', openConfirmationModal);

  // Kontrol Modal Konfirmasi Akhir
  document.getElementById('close-modal-x').addEventListener('click', closeConfirmationModal);
  document.getElementById('cancel-modal-btn').addEventListener('click', closeConfirmationModal);

  document.getElementById('verify-identity-checkbox').addEventListener('change', (event) => {
    document.getElementById('confirm-bank-btn').disabled = !event.target.checked;
  });

  document.getElementById('confirm-bank-btn').addEventListener('click', handleProceedToBank);

  // Tutup modal jika klik area backdrop di luar kotak dialog
  document.getElementById('confirmation-modal').addEventListener('click', (event) => {
    if (event.target.id === 'confirmation-modal') {
      closeConfirmationModal();
    }
  });

  // Tutup banner notifikasi
  document.getElementById('close-banner-btn').addEventListener('click', () => {
    document.getElementById('bank-redirect-banner').classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', initApp);
