import React from "react";
import { getBookcoverUrl } from "../../services/bookService";

const BookDetailModal = ({ isOpen, onClose, book, onBorrow }) => {
  if (!isOpen || !book) return null;

  const coverUrl = getBookcoverUrl(book.cover_image);
  const stockPercentage =
    book.stock > 0 ? (book.available_stock / book.stock) * 100 : 0;
  const statusColor =
    stockPercentage === 0
      ? "error"
      : stockPercentage < 30
        ? "amber"
        : "primary";
  const statusText =
    stockPercentage === 0
      ? "Out of Stock"
      : stockPercentage < 30
        ? "Low Stock"
        : "Available";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-surface-container-low">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">
              menu_book
            </span>
            <h3 className="font-headline text-xl font-bold text-on-surface">
              Book Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="md:w-1/3">
              <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-outline">
                      menu_book
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:w-2/3 space-y-4">
              <div>
                <h2 className="font-headline text-2xl font-extrabold text-primary">
                  {book.title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    ISBN: {book.isbn || "-"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    • {book.published_year || "-"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Author
                  </label>
                  <p className="text-sm font-semibold text-on-surface">
                    {book.author?.name || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Publisher
                  </label>
                  <p className="text-sm text-on-surface">
                    {book.publisher || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Pages
                  </label>
                  <p className="text-sm text-on-surface">{book.pages || "-"}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {book.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-secondary-container text-on-secondary-container rounded-full"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Stock Status
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-${statusColor}`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-on-surface">
                    {book.available_stock} / {book.stock}
                  </span>
                </div>
                <p className={`text-xs font-medium mt-1 text-${statusColor}`}>
                  {statusText}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Description
                </label>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {book.description || "No description available."}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-container-low">
                <div className="flex gap-2 text-[10px] text-on-surface-variant/60">
                  <span>
                    Created: {new Date(book.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Last updated:{" "}
                    {new Date(book.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-container-low flex justify-end gap-2">
          {onBorrow && (
            <button
              onClick={() => onBorrow(book)}
              className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-primary-container hover:scale-105 transition transition-all transition-colors"
            >
              Borrow Book
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-surface-container-high text-on-surface-variant rounded-lg font-bold text-sm hover:bg-surface-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
