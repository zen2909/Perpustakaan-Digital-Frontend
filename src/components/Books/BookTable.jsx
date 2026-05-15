import React from "react";
import BookTableRow from "./BookTableRow";

const BookTable = ({
  books,
  onEdit,
  onView,
  onArchive,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low">
            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70">
              Book Details
            </th>
            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70">
              Author
            </th>
            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70">
              Availability
            </th>
            <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/70 text-right">
              Registry Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-teal-900/5">
          {books.map((book) => (
            <BookTableRow
              key={book.id}
              book={book}
              onEdit={onEdit}
              onView={onView}
              onArchive={onArchive}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center">
        <p className="text-xs font-medium text-on-surface-variant/70 uppercase tracking-widest">
          Showing {books.length} of {totalItems} volumes
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-white text-on-surface-variant/60 disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === currentPage
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-white text-on-surface-variant"
                }`}
              >
                {page}
              </button>
            ),
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg hover:bg-white text-on-surface-variant/60 disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
