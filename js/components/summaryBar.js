window.InfoKHS = window.InfoKHS || {};

window.InfoKHS.getSelectedBills = function (state) {
  return state.bills.filter((bill) => state.selectedBillIds.has(bill.id) && bill.sisaKekurangan > 0);
};

window.InfoKHS.updateCheckoutSummary = function (state) {
  const { formatRupiah, getSelectedBills } = window.InfoKHS;
  const selectedBills = getSelectedBills(state);
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
    previewContainer.innerHTML = selectedBills
      .map(
        (bill) =>
          `<span class="inline-block bg-slate-100 border border-slate-200 text-slate-800 font-medium text-xs px-2.5 py-1 rounded-md mr-1.5 mb-1 whitespace-normal break-words">${bill.jenisBiaya} (${formatRupiah(bill.sisaKekurangan)})</span>`
      )
      .join('');
    proceedBtn.disabled = false;
    clearBtn.classList.remove('hidden');
  }
};
