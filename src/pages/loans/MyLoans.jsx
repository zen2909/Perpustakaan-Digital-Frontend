// src/pages/member/MyLoansPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { getMemberloans, createFinePayment } from "../../services/loanService";
import { getBookcoverUrl } from "../../services/bookService";
import SkeletonLoading from "../../components/ui/SkeletonLoading";
import QRCodeModal from "../../components/ui/QRCodeModal";
import { getStatusConfig } from "../../config/statusConfig";
const MyLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingFines, setPendingFines] = useState(0);
  const [activeItems, setActiveItems] = useState(0);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [qrType, setQrType] = useState("borrow"); // 'borrow' or 'return'
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect ke login jika token hilang
      window.location.href = "/";
      return;
    }
    const fetchLoans = async () => {
      try {
        const res = await getMemberloans();
        const data = res.data?.data || res.data || [];
        setLoans(data);

        const pendingFines = data.reduce((sum, loan) => {
          const isUnpaid =
            loan.fine_status === "unpaid" && loan.fine_amount > 0;
          // Hanya hitung denda untuk loan yang sudah returned (karena overdue hanya menghitung denda)
          const shouldCount = loan.status === "returned" && isUnpaid;
          return sum + (shouldCount ? Number(loan.fine_amount) : 0);
        }, 0);
        setPendingFines(pendingFines);

        const active = data.filter(
          (loan) => loan.status === "approved" || loan.status === "borrowed",
        ).length;
        setActiveItems(active);
      } catch (err) {
        console.error(err);
        setError("Failed to load your loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment_status") === "success") {
      showToast("Pembayaran berhasil!", "success");
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => fetchLoans(), 1500);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRupiah = (amount) => {
    if (!amount || amount === 0) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleShowQR = (loan, type) => {
    setSelectedLoan(loan);
    setQrType(type);
    setQrModalOpen(true);
  };

  const handlePayFine = async (loan) => {
    try {
      const res = await createFinePayment(loan.id);
      console.log("Payment response:", res.data);

      // Ambil invoice_url dari response backend
      const invoiceUrl = res.data?.invoice_url;

      if (invoiceUrl) {
        // Redirect ke halaman pembayaran Xendit
        window.location.href = invoiceUrl;
      } else {
        showToast("Payment link not received from server", "error");
      }
    } catch (err) {
      console.error("Payment error:", err);
      showToast(
        err.response?.data?.message || "Failed to process payment",
        "error",
      );
    }
  };

  const getFineDisplay = (loan) => {
    // Status yang tidak punya denda
    if (
      loan.status === "approved" ||
      loan.status === "pending" ||
      loan.status === "borrowed"
    ) {
      return (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
            <span className="material-symbols-outlined text-gray-400 text-sm">
              remove
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">
              —
            </span>
          </div>
        </div>
      );
    }

    // Status overdue: "Calculating fine..."
    if (loan.status === "overdue") {
      return (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-amber-500 text-sm ">
              schedule
            </span>
            <span className="text-[10px] sm:text-xs text-amber-600 uppercase font-bold">
              Calculating...
            </span>
          </div>
        </div>
      );
    }

    // Status returned
    if (loan.status === "returned") {
      // Paid
      if (loan.fine_status === "paid") {
        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-green-500 text-sm ">
                check_circle
              </span>
              <span className="text-[10px] sm:text-xs text-green-600 uppercase font-bold">
                Paid
              </span>
            </div>
          </div>
        );
      }
      // Unpaid
      else if (loan.fine_amount > 0) {
        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-red-500 text-sm">
                receipt
              </span>
              <span className="text-[10px] sm:text-xs text-red-600 ">
                {formatRupiah(loan.fine_amount)}
              </span>
            </div>
          </div>
        );
      }
    }

    // Default fallback
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
          <span className="material-symbols-outlined text-gray-400 text-sm">
            remove
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">
            —
          </span>
        </div>
      </div>
    );
  };

  if (loading) return <SkeletonLoading type="loans" />;
  if (error) return <div className="p-8 text-error">{error}</div>;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      {/* Header */}
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-inter text-[10px] uppercase tracking-[0.15em] text-primary font-bold mb-1 block">
            Personal Archives
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-manrope font-extrabold text-on-surface tracking-tight">
            My Loans
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {/* Pending Fines Card */}
          <div className="bg-surface-container-lowest p-3 sm:p-4 md:p-5 rounded-xl shadow-sm flex flex-col justify-between min-w-[130px] sm:min-w-[160px] md:min-w-[180px] relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-2 -top-2 text-primary/5 text-5xl group-hover:text-primary/10 transition-colors">
              account_balance_wallet
            </span>
            <p className="font-inter text-[9px] sm:text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Pending Fines
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-manrope font-extrabold text-primary">
              {formatRupiah(pendingFines)}
            </p>
          </div>
          {/* Active Loans Card */}
          <div className="bg-surface-container-lowest p-3 sm:p-4 md:p-5 rounded-xl shadow-sm flex flex-col justify-between min-w-[130px] sm:min-w-[160px] md:min-w-[180px] relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-2 -top-2 text-primary/5 text-5xl group-hover:text-primary/10 transition-colors">
              auto_stories
            </span>
            <p className="font-inter text-[9px] sm:text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Active Loans
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-manrope font-extrabold text-primary">
              {activeItems}
            </p>
          </div>
        </div>
      </header>

      {/* Borrow & Return Instructions - SELALU DI ATAS TABEL */}
      <div className="mb-6">
        <div className="bg-surface-container-high rounded-xl p-5 sm:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">
                info
              </span>
              <h3 className="font-manrope font-extrabold text-base sm:text-lg uppercase tracking-wider">
                Instruksi Peminjaman & Pengembalian
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Kolom Peminjaman */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-primary/30">
                  <span className="material-symbols-outlined text-primary text-sm">
                    qr_code_scanner
                  </span>
                  <h4 className="font-manrope font-bold text-sm text-primary uppercase tracking-wide">
                    Proses Peminjaman Buku
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Bawa buku yang ingin dipinjam ke{" "}
                      <span className="font-bold text-on-surface">
                        petugas perpustakaan
                      </span>
                      .
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Tunjukkan{" "}
                      <span className="font-bold text-on-surface">
                        QR Code peminjaman
                      </span>{" "}
                      pada aplikasi Anda.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Petugas akan memindai QR Code dan status peminjaman akan
                      berubah menjadi{" "}
                      <span className="font-bold text-primary">"Borrowed"</span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Kolom Pengembalian */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-primary/30">
                  <span className="material-symbols-outlined text-primary text-sm">
                    assignment_return
                  </span>
                  <h4 className="font-manrope font-bold text-sm text-primary uppercase tracking-wide">
                    Proses Pengembalian Buku
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Bawa buku yang akan dikembalikan ke{" "}
                      <span className="font-bold text-on-surface">
                        petugas perpustakaan
                      </span>
                      .
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Tunjukkan{" "}
                      <span className="font-bold text-on-surface">
                        QR Code pengembalian
                      </span>{" "}
                      pada aplikasi Anda.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Petugas akan memindai QR Code dan buku akan terupdate
                      menjadi{" "}
                      <span className="font-bold text-primary">"Returned"</span>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan tambahan */}
            <div className="mt-4 pt-3 border-t border-outline-variant/30">
              <p className="text-[10px] text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">info</span>
                Pastikan QR Code selalu tersedia di aplikasi Anda untuk proses
                peminjaman dan pengembalian yang cepat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-surface-container-lowest rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[800px] md:min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-3 py-3 sm:px-4 font-inter text-[10px] uppercase tracking-wider text-on-surface-variant font-bold rounded-tl-xl text-left">
                    Book Details
                  </th>
                  <th className="px-3 py-3 sm:px-4 font-inter text-[10px] uppercase tracking-wider text-on-surface-variant font-bold text-left">
                    Loan Date
                  </th>
                  <th className="px-3 py-3 sm:px-4 font-inter text-[10px] uppercase tracking-wider text-on-surface-variant font-bold text-left">
                    Due Date
                  </th>
                  <th className="px-3 py-3 sm:px-4 font-inter text-[10px] uppercase tracking-wider text-on-surface-variant font-bold text-center">
                    Status
                  </th>
                  <th className="px-3 py-3 sm:px-4 font-inter text-[10px] uppercase tracking-wider text-on-surface-variant font-bold text-center">
                    Fines
                  </th>
                  <th className="px-3 py-3 sm:px-4 font-inter text-[10px] uppercase tracking-wider text-on-surface-variant font-bold text-center rounded-tr-xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {loans.map((loan) => {
                  const coverUrl = getBookcoverUrl(loan.book?.cover_image);
                  const isFineUnpaid =
                    loan.fine_status === "unpaid" && loan.fine_amount > 0;
                  const isFinePaid = loan.fine_status === "paid";

                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      {/* Book Details */}
                      <td className="px-3 py-4 sm:px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-surface-container rounded shadow-sm overflow-hidden flex-shrink-0">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={loan.book?.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML =
                                    '<div class="w-full h-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-outline">menu_book</span></div>';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                                <span className="material-symbols-outlined text-outline">
                                  menu_book
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-manrope font-bold text-sm text-on-surface truncate max-w-[140px] sm:max-w-[200px]">
                              {loan.book?.title || "Unknown"}
                            </p>
                            <p className="font-inter text-xs text-on-surface-variant truncate">
                              {loan.book?.author?.name || "Unknown Author"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Loan Date */}
                      <td className="px-3 py-4 sm:px-4 font-inter text-xs sm:text-sm text-on-surface-variant whitespace-nowrap">
                        {formatDate(loan.loan_date)}
                      </td>

                      {/* Due Date */}
                      <td className="px-3 py-4 sm:px-4 font-inter text-xs sm:text-sm text-on-surface-variant whitespace-nowrap">
                        {formatDate(loan.due_date)}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 sm:px-4">
                        <div className="flex justify-center">
                          {(() => {
                            const config = getStatusConfig(loan.status);
                            return (
                              <span
                                className={`inline-flex items-center justify-center gap-1 px-2 py-1 ${config.bgColor} ${config.textColor} text-[9px] sm:text-[10px] font-semibold uppercase rounded-full border ${config.borderColor} shadow-sm ${config.pulse ? "animate-pulse" : ""}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${config.dotColor}`}
                                ></span>
                                <span className="material-symbols-outlined text-xs sm:text-sm">
                                  {config.icon}
                                </span>
                                <span className="font-bold uppercase">
                                  {config.label}
                                </span>
                              </span>
                            );
                          })()}
                        </div>
                      </td>

                      {/* Fines */}
                      <td className="px-3 py-4 sm:px-4">
                        <div className="flex justify-center">
                          {getFineDisplay(loan)}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-3 py-4 sm:px-4">
                        <div className="flex justify-center">
                          {/* PENDING */}
                          {loan.status === "pending" && (
                            <div className="group relative">
                              <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-amber-500 text-sm">
                                  schedule
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-medium text-amber-600">
                                  Wait
                                </span>
                              </div>
                            </div>
                          )}

                          {/* APPROVED */}
                          {loan.status === "approved" && loan.qr_token && (
                            <button
                              onClick={() => handleShowQR(loan, "borrow")}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined text-emerald-600 text-sm">
                                qr_code_scanner
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-medium text-emerald-600">
                                Borrow
                              </span>
                            </button>
                          )}

                          {/* BORROWED or OVERDUE */}
                          {(loan.status === "borrowed" ||
                            loan.status === "overdue") &&
                            loan.token_return && (
                              <button
                                onClick={() => handleShowQR(loan, "return")}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-blue-600 text-sm">
                                  qr_code_scanner
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-medium text-blue-600">
                                  Return
                                </span>
                              </button>
                            )}

                          {/* RETURNED UNPAID */}
                          {loan.status === "returned" && isFineUnpaid && (
                            <button
                              onClick={() => handlePayFine(loan)}
                              className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-all shadow-sm animate-pulse"
                            >
                              <span className="material-symbols-outlined text-red-500 text-sm">
                                payment
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-medium text-red-600">
                                Pay
                              </span>
                            </button>
                          )}

                          {/* RETURNED PAID */}
                          {loan.status === "returned" && isFinePaid && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full shadow-sm">
                              <span className="material-symbols-outlined text-green-500 text-sm">
                                check_circle
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-medium text-green-600">
                                Done
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {loans.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-on-surface-variant"
                    >
                      No loans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fine Payment CTA (jika ada denda) */}
      {pendingFines > 0 && (
        <div className="mt-6 bg-gradient-to-br from-tertiary to-tertiary-container text-white rounded-xl p-5 shadow-xl flex flex-col items-center text-center">
          <h3 className="font-manrope font-extrabold text-base sm:text-lg mb-2">
            Resolve Outstanding Fines
          </h3>
          <p className="font-inter text-xs sm:text-sm text-on-tertiary-container mb-4">
            You have {formatRupiah(pendingFines)} in unpaid fines.
          </p>
          <button className="px-6 py-2 bg-white text-tertiary rounded-xl font-manrope font-bold text-sm hover:bg-neutral-100 transition-all">
            Settle Balance
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        token={
          qrType === "borrow"
            ? selectedLoan?.qr_token
            : selectedLoan?.token_return
        }
        title={
          qrType === "borrow"
            ? "QR Code untuk Peminjaman Buku"
            : "QR Code untuk Pengembalian Buku"
        }
      />

      {/* Toast Notification (sama seperti sebelumnya) */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center bg-white/85 backdrop-blur-xl p-3 rounded-xl shadow-xl border border-white/20 max-w-[90vw] sm:max-w-md">
          <div
            className={`w-1 h-6 rounded-full mr-3 ${toast.type === "success" ? "bg-primary" : "bg-error"}`}
          ></div>
          <div className="mr-4">
            <h5 className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
              {toast.type === "success" ? "Success" : "Error"}
            </h5>
            <p className="text-xs text-on-surface-variant font-medium">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyLoansPage;
