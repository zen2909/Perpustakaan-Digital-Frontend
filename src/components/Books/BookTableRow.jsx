// src/components/books/BookTableRow.jsx
import React, { useState } from "react";

const BookTableRow = ({ book, onEdit, onView, onArchive }) => {
  const [imgError, setImgError] = useState(false);
  const coverUrl = book.cover_image;
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        color: "error",
        width: "0%",
        bgColor: "bg-error",
      };
    }
    if (stock < 5) {
      return {
        label: `${stock} In Stock`,
        color: "amber",
        width: `${(stock / 20) * 100}%`,
        bgColor: "bg-amber-500",
      };
    }
    return {
      label: `${stock} In Stock`,
      color: "emerald",
      width: `${Math.min((stock / 30) * 100, 100)}%`,
      bgColor: "bg-primary",
    };
  };

  const status = getStockStatus(book.stock);

  return (
    <tr className="group hover:bg-emerald-50/30 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-16 bg-surface-container rounded shadow-sm overflow-hidden flex-shrink-0">
            {coverUrl && !imgError ? (
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                  menu_book
                </span>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface">
              {book.title}
            </h4>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">
              {book.category_name || "Uncategorized"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-sm font-semibold text-on-surface-variant">
          {book.author_name || "Unknown Author"}
        </p>
        <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-tighter">
          {book.publisher || "—"}
        </p>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2 h-2 rounded-full ${
              status.color === "error"
                ? "bg-error"
                : status.color === "amber"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          ></span>
          <span className="text-sm font-bold text-on-surface">
            {status.label}
          </span>
        </div>
        <div className="w-32 h-1 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={`h-full ${status.bgColor}`}
            style={{ width: status.width }}
          ></div>
        </div>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-on-surface-variant/60 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
            title="Edit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={() => onView(book)}
            className="p-2 text-on-surface-variant/60 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
            title="View Details"
          >
            <span className="material-symbols-outlined text-sm">
              visibility
            </span>
          </button>
          <button
            onClick={() => onArchive(book)}
            className="p-2 text-on-surface-variant/60 hover:text-error transition-colors hover:bg-error/5 rounded-lg"
            title="Delete"
          >
            <span className="material-symbols-outlined text-sm">archive</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookTableRow;
