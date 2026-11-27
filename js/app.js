(function () {
  const {
    formatRupiah,
    fetchStudentBillingData,
    renderBillsTable,
    updateCheckoutSummary,
    openConfirmationModal,
    closeConfirmationModal,
    handleProceedToBank
  } = window.InfoKHS;

  const state = {
    student: null,
    bills: [],
    selectedBillIds: new Set(),
    currentFilter: 'all'
  };

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

  function handleToggleBill(billId, forceState) {
    const targetBill = state.bills.find((b) => b.id === billId);
    if (!targetBill || targetBill.sisaKekurangan <= 0) return;

    const shouldSelect =
      typeof forceState === 'boolean' ? forceState : !state.selectedBillIds.has(billId);

    if (shouldSelect) {
      state.selectedBillIds.add(billId);
    } else {
      state.selectedBillIds.delete(billId);
    }

    renderBillsTable(state, handleToggleBill);
    updateCheckoutSummary(state);
  }

  async function initApp() {
    const data = await fetchStudentBillingData();
    state.student = data.student;
    state.bills = data.bills;

    renderStudentProfile();
    renderBillsTable(state, handleToggleBill);
    updateCheckoutSummary(state);

    document.getElementById('select-all-checkbox').addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      state.bills.forEach((bill) => {
        if (bill.sisaKekurangan > 0) {
          isChecked ? state.selectedBillIds.add(bill.id) : state.selectedBillIds.delete(bill.id);
        }
      });
      renderBillsTable(state, handleToggleBill);
      updateCheckoutSummary(state);
    });

    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currentFilter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach((b) => {
          b.className =
            'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition';
        });
        btn.className =
          'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-umm-maroon text-white transition';
        renderBillsTable(state, handleToggleBill);
      });
    });

    document.getElementById('clear-selection-btn').addEventListener('click', () => {
      state.selectedBillIds.clear();
      renderBillsTable(state, handleToggleBill);
      updateCheckoutSummary(state);
    });

    document.getElementById('proceed-checkout-btn').addEventListener('click', () => {
      openConfirmationModal(state);
    });

    document.getElementById('close-modal-x').addEventListener('click', closeConfirmationModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeConfirmationModal);

    document.getElementById('verify-identity-checkbox').addEventListener('change', (event) => {
      document.getElementById('confirm-bank-btn').disabled = !event.target.checked;
    });

    document.getElementById('confirm-bank-btn').addEventListener('click', () => {
      handleProceedToBank(state);
    });

    document.getElementById('confirmation-modal').addEventListener('click', (event) => {
      if (event.target.id === 'confirmation-modal') closeConfirmationModal();
    });

    document.getElementById('close-banner-btn').addEventListener('click', () => {
      document.getElementById('bank-redirect-banner').classList.add('hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
