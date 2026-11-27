window.InfoKHS = window.InfoKHS || {};

window.InfoKHS.openConfirmationModal = function (state) {
  const { formatRupiah, getSelectedBills } = window.InfoKHS;
  const selectedBills = getSelectedBills(state);
  if (selectedBills.length === 0) return;

  document.getElementById('modal-student-name').textContent = state.student.nama;
  document.getElementById('modal-student-nim').textContent = state.student.nim;
  document.getElementById('modal-student-major').textContent = `${state.student.jurusan} — ${state.student.fakultas}`;

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
};

window.InfoKHS.closeConfirmationModal = function () {
  const modal = document.getElementById('confirmation-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
};

window.InfoKHS.handleProceedToBank = function (state) {
  const { formatRupiah, getSelectedBills, closeConfirmationModal } = window.InfoKHS;
  const selectedBills = getSelectedBills(state);
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
};
