// src/components/member/RecommendedBooks.jsx
import React from "react";

const RecommendedBooks = ({ books = [], onViewAll }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
            <p className="text-[9px] font-bold text-primary uppercase tracking-tighter">
              Available
            </p>
          </div>
        );
      case "borrowed":
        return (
          <div className="absolute top-4 right-4 bg-surface-container-highest px-3 py-1 rounded-full shadow-sm">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">
              Borrowed
            </p>
          </div>
        );
      case "on-hold":
        return (
          <div className="absolute top-4 right-4 bg-error-container px-3 py-1 rounded-full shadow-sm">
            <p className="text-[9px] font-bold text-error uppercase tracking-tighter">
              On Hold
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold font-headline tracking-tight">
          Recommended for You
        </h2>
        <button
          onClick={onViewAll}
          className="text-sm font-bold text-primary flex items-center gap-1 group"
        >
          View All Collections
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <div key={book.id} className="group cursor-pointer">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-low mb-4 relative shadow-sm">
              <img
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={book.coverImage}
              />
              {getStatusBadge(book.status)}
            </div>
            <h4 className="font-headline font-bold text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors">
              {book.title}
            </h4>
            <p className="text-xs text-on-surface-variant font-medium">
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedBooks;
