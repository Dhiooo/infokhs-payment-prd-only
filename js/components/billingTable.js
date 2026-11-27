window.InfoKHS = window.InfoKHS || {};

window.InfoKHS.renderBillsTable = function (state, onToggleBill) {
  const { formatRupiah } = window.InfoKHS;
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
    window.InfoKHS.updateSelectAllCheckboxState(state);
    return;
  }

  filteredBills.forEach((bill) => {
    const isPaid = bill.sisaKekurangan === 0;
    const isSelected = state.selectedBillIds.has(bill.id);

    const tr = document.createElement('tr');
    tr.dataset.billId = bill.id;
    tr.className = isPaid
      ? 'bg-slate-50/90 text-slate-400 opacity-70 select-none'
      : isSelected
        ? 'bg-red-50/60 hover:bg-red-50 transition cursor-pointer'
        : 'bg-white hover:bg-slate-50 transition cursor-pointer';

    const checkboxCellHtml = isPaid
      ? `<span class="inline-block text-slate-300 text-xs font-medium" aria-hidden="true">—</span>`
      : `<input
          type="checkbox"
          class="bill-checkbox w-4 h-4 rounded border-slate-300 text-umm-maroon focus:ring-umm-maroon cursor-pointer"
          data-id="${bill.id}"
          aria-label="Pilih tagihan ${bill.jenisBiaya}"
          ${isSelected ? 'checked' : ''}
        />`;

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
            class="locked-nominal-input w-40 sm:w-44 pl-7 pr-3 py-1.5 text-right font-mono text-xs sm:text-sm font-bold rounded-lg border border-slate-200 bg-gray-100 text-slate-700 cursor-not-allowed"
          />
        </div>
      </div>
    `;

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

    tr.innerHTML = `
      <td class="py-3.5 pl-5 pr-3 text-center align-middle">${checkboxCellHtml}</td>
      <td class="py-3.5 px-3 text-xs font-medium ${isPaid ? 'text-slate-400' : 'text-slate-600'} whitespace-normal break-words">${bill.periode}</td>
      <td class="py-3.5 px-3 font-semibold ${isPaid ? 'text-slate-500' : 'text-slate-900'} whitespace-normal break-words leading-snug">${bill.jenisBiaya}</td>
      <td class="py-3.5 px-3 text-right font-mono text-xs sm:text-sm ${isPaid ? 'text-slate-400' : 'text-slate-600'}">${formatRupiah(bill.totalTagihan)}</td>
      <td class="py-3.5 px-3 text-right font-mono text-xs sm:text-sm ${isPaid ? 'text-slate-400' : 'text-slate-600'}">${formatRupiah(bill.terbayar)}</td>
      <td class="py-3.5 px-3 text-right">${lockedNominalHtml}</td>
      <td class="py-3.5 pl-3 pr-5 text-center align-middle">${statusBadgeHtml}</td>
    `;

    if (!isPaid) {
      tr.addEventListener('click', (event) => {
        if (event.target.classList.contains('bill-checkbox')) return;
        onToggleBill(bill.id);
      });

      tr.querySelector('.bill-checkbox').addEventListener('change', (event) => {
        onToggleBill(bill.id, event.target.checked);
      });
    }

    tbody.appendChild(tr);
  });

  window.InfoKHS.updateSelectAllCheckboxState(state);
};

window.InfoKHS.updateSelectAllCheckboxState = function (state) {
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

  selectAllEl.checked = selectedActiveCount === activeBills.length;
  selectAllEl.indeterminate = selectedActiveCount > 0 && selectedActiveCount < activeBills.length;
};
