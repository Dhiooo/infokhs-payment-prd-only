window.InfoKHS = window.InfoKHS || {};

window.InfoKHS.formatRupiah = function (amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Simulasi penarikan data (GET) dari server Biro Keuangan UMM (FR-05)
window.InfoKHS.fetchStudentBillingData = function () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(structuredClone(window.InfoKHS.MOCK_DATABASE));
    }, 100);
  });
};
