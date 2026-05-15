// src/pages/loans/LoansPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  getAllLoans,
  approveLoan,
  deleteLoan,
  getTotalActiveLoans,
  getTotalOverdueLoans,
  getTotalFinesToday,
  scanBorrow,
  scanReturn,
} from "../../services/loanService";
import SkeletonLoading from "../../components/ui/SkeletonLoading";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    overdue: 0,
    returnedToday: 0,
  });
  const [toast, setToast] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanAction, setScanAction] = useState(null); // 'borrow' or 'return'
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const itemsPerPage = 10;

  // Fetch loans
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };
      const res = await getAllLoans(params);
      const data = res.data?.data || res.data || [];
      const meta = res.data?.meta || {
        current_page: 1,
        last_page: 1,
        total: 0,
      };
      setLoans(data);
      setFilteredLoans(data);
      setTotalPages(meta.last_page || 1);
      setTotalItems(meta.total || 0);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data peminjaman");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const [activeRes, overdueRes, finesTodayRes] = await Promise.allSettled([
        getTotalActiveLoans(),
        getTotalOverdueLoans(),
        getTotalFinesToday(),
      ]);
      const active =
        activeRes.status === "fulfilled" ? activeRes.value.data || 0 : 0;
      const overdue =
        overdueRes.status === "fulfilled" ? overdueRes.value.data || 0 : 0;
      setStats((prev) => ({ ...prev, active, overdue }));
    } catch (err) {
      console.error("Stats error", err);
    }
  };

  useEffect(() => {
    if (loans.length) {
      const pendingCount = loans.filter((l) => l.status === "pending").length;
      const returnedTodayCount = loans.filter(
        (l) =>
          l.status === "returned" &&
          l.return_date === new Date().toISOString().slice(0, 10),
      ).length;
      setStats((prev) => ({
        ...prev,
        pending: pendingCount,
        returnedToday: returnedTodayCount,
      }));
    }
  }, [loans]);

  useEffect(() => {
    fetchLoans();
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this loan request?")) return;
    try {
      await approveLoan(id);
      showToast("Loan approved successfully", "success");
      fetchLoans();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to approve", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan record?")) return;
    try {
      await deleteLoan(id);
      showToast("Loan deleted", "success");
      fetchLoans();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const handleSendAlert = (loan) => {
    showToast(`Alert sent to ${loan.user?.name} for overdue book`, "info");
  };

  const startScanner = (action) => {
    setScanAction(action);
    setIsScannerOpen(true);
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current
        .stop()
        .catch((err) => console.error("Stop scanner error:", err));
    }
    setIsScannerOpen(false);
    setScanAction(null);
  };

  const onScanSuccess = async (decodedText) => {
    console.log("Scanned text:", decodedText);

    // Bersihkan token jika dalam bentuk URL
    let cleanToken = decodedText;
    if (cleanToken.includes("/scan/")) {
      cleanToken = cleanToken.split("/scan/")[1];
    }

    if (!cleanToken || cleanToken.trim() === "") {
      showToast("Invalid QR code: empty token", "error");
      return;
    }

    console.log("Clean token:", cleanToken);

    try {
      if (scanAction === "borrow") {
        await scanBorrow({ qr_token: cleanToken });
        showToast("Loan activated successfully", "success");
      } else if (scanAction === "return") {
        await scanReturn({ token_return: cleanToken });
        showToast("Book returned successfully", "success");
      }
      stopScanner();
      fetchLoans();
      fetchStats();
    } catch (err) {
      console.error("Scan API error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.qr_token?.[0] ||
        "Invalid QR code";
      showToast(errorMsg, "error");
    }
    const response = await scanBorrow({ qr_token: cleanToken });
    console.log("Full response:", response);
    console.log("Token return from response:", response.data?.token_return);
  };

  const onScanError = (err) => {
    console.warn("Scan error:", err);
    // Tidak perlu showToast setiap error karena terlalu sering
  };

  // Inisialisasi scanner saat modal terbuka
  useEffect(() => {
    if (isScannerOpen && scannerRef.current) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
      html5QrCode
        .start(
          { facingMode: "environment" }, // pakai kamera belakang
          { fps: 10, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          onScanError,
        )
        .catch((err) => {
          console.error("Failed to start scanner:", err);
          showToast(
            "Failed to access camera. Please check permissions.",
            "error",
          );
          stopScanner();
        });
    }
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch((e) => console.error(e));
      }
    };
  }, [isScannerOpen]);

  if (loading && loans.length === 0) return <SkeletonLoading type="loans" />;
  if (error) return <div className="p-10 text-error">{error}</div>;

  return (
    <div className="p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl text-primary font-extrabold tracking-tight">
            Loan Management
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm max-w-lg">
            Oversee the circulation of the physical collection, authorize new
            requests, and track overdue volumes.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => startScanner("borrow")}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">
              qr_code_scanner
            </span>
            Scan Borrow
          </button>
          <button
            onClick={() => startScanner("return")}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">
              qr_code_scanner
            </span>
            Scan Return
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* ... kartu statistik (sama seperti sebelumnya) ... */}
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -top-2 -right-2 text-6xl text-primary/5 group-hover:scale-110 transition-transform">
            pending_actions
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Awaiting Approval
          </p>
          <h3 className="text-3xl font-extrabold text-primary">
            {stats.pending}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -top-2 -right-2 text-6xl text-primary/5 group-hover:scale-110 transition-transform">
            menu_book
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Active Loans
          </p>
          <h3 className="text-3xl font-extrabold text-primary">
            {stats.active}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group border-l-4 border-error/20">
          <span className="material-symbols-outlined absolute -top-2 -right-2 text-6xl text-error/5 group-hover:scale-110 transition-transform">
            assignment_late
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-error mb-1">
            Overdue Items
          </p>
          <h3 className="text-3xl font-extrabold text-error">
            {stats.overdue}
          </h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -top-2 -right-2 text-6xl text-primary/5 group-hover:scale-110 transition-transform">
            check_circle
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            Returned (24h)
          </p>
          <h3 className="text-3xl font-extrabold text-primary">
            {stats.returnedToday}
          </h3>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search by user or book title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "borrowed", "overdue", "returned"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Tabel Loan (sederhana, tanpa aksi scan di setiap row karena sudah ada tombol global) */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-bold">
                User
              </th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-bold">
                Book
              </th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-bold">
                Loan Date
              </th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-bold">
                Due Date
              </th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-bold">
                Status
              </th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.1em] text-on-surface-variant font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {filteredLoans.map((loan) => (
              <tr
                key={loan.id}
                className="hover:bg-surface-container-low/40 transition-colors"
              >
                <td className="px-8 py-6">{loan.user?.name}</td>
                <td className="px-8 py-6">{loan.book?.title}</td>
                <td className="px-8 py-6">{loan.loan_date || "-"}</td>
                <td className="px-8 py-6">{loan.due_date || "-"}</td>
                <td className="px-8 py-6">
                  {loan.status === "pending" && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      Pending
                    </span>
                  )}
                  {loan.status === "borrowed" && (
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
                      Borrowed
                    </span>
                  )}
                  {loan.status === "overdue" && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      Late
                    </span>
                  )}
                  {loan.status === "returned" && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                      Returned
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  {loan.status === "pending" && (
                    <button
                      onClick={() => handleApprove(loan.id)}
                      className="text-primary hover:underline"
                    >
                      Approve
                    </button>
                  )}
                  {(loan.status === "pending" ||
                    loan.status === "borrowed" ||
                    loan.status === "overdue") && (
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="ml-2 text-error hover:underline"
                    >
                      Delete
                    </button>
                  )}
                  {loan.status === "overdue" && (
                    <button
                      onClick={() => handleSendAlert(loan)}
                      className="ml-2 text-error hover:underline"
                    >
                      Alert
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">
                Scan {scanAction === "borrow" ? "Borrow" : "Return"} QR Code
              </h3>
              <button
                onClick={stopScanner}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div
              id="qr-reader"
              ref={scannerRef}
              style={{ width: "100%", maxHeight: "300px" }}
            ></div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Arahkan kamera ke QR code yang ditampilkan member.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notifikasi */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center bg-white p-4 rounded-xl shadow-xl">
          <div
            className={`w-1 h-8 rounded-full mr-4 ${toast.type === "success" ? "bg-primary" : "bg-error"}`}
          ></div>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default LoansPage;
