import React from "react";

const PendingLoansTable = ({ loans = [], onApprove, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "secondary";
      case "returned":
        return "success";
      case "late":
        return "error";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending";
      case "approved":
        return "Active";
      case "returned":
        return "Returned";
      case "late":
        return "Overdue";
      default:
        return status || "-";
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      <div className="px-8 py-6 border-b border-surface-container-low flex justify-between items-center">
        <h3 className="font-headline font-bold text-lg">Pending Loans</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Create Loan
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-8 py-4 font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Book Title
              </th>
              <th className="px-8 py-4 font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Borrower
              </th>
              <th className="px-8 py-4 font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Due Date
              </th>
              <th className="px-8 py-4 font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-4 font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {loans.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-12 text-center text-on-surface-variant"
                >
                  No pending loans
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr
                  key={loan.id}
                  className="hover:bg-surface-container-low/20 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 bg-surface-container rounded shrink-0 overflow-hidden">
                        {loan.book?.cover ? (
                          <img
                            src={loan.book.cover}
                            alt={loan.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">
                              menu_book
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">
                          {loan.book?.title || "Unknown Title"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                          {loan.book?.author ||
                            loan.book?.authors?.[0]?.name ||
                            "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">
                    {loan.user?.name ||
                      loan.member?.name ||
                      loan.borrower_name ||
                      "-"}
                  </td>
                  <td className="px-8 py-5 text-sm">
                    {formatDate(loan.due_date)}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full bg-${getStatusColor(loan.status)}-container text-on-${getStatusColor(loan.status)}-container text-[10px] font-bold uppercase tracking-tight`}
                    >
                      {getStatusLabel(loan.status)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => onViewDetails?.(loan.id)}
                      className="text-primary hover:underline text-sm font-semibold"
                    >
                      Details
                    </button>
                    {loan.status === "pending" && onApprove && (
                      <button
                        onClick={() => onApprove(loan.id)}
                        className="ml-3 text-success hover:underline text-sm font-semibold"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-4 bg-surface-container-low/30 text-center">
        <button className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors">
          View All Archive Records
        </button>
      </div>
    </div>
  );
};

export default PendingLoansTable;
