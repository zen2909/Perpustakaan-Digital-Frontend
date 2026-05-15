// src/pages/member/CatalogPage.jsx
import React, { useState, useEffect } from "react";
import { getBooks, getBookcoverUrl } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import { storeLoan } from "../../services/loanService";
import SkeletonLoading from "../../components/ui/SkeletonLoading";
import BookDetailModal from "../../components/books/BookDetailModal";

const BookCard = ({ book, onClick }) => {
  const coverUrl = getBookcoverUrl(book.cover_image);
  const [imgError, setImgError] = useState(false);
  const isAvailable = book.stock > 0;

  return (
    <div className="group cursor-pointer" onClick={() => onClick(book)}>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-highest mb-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
        {coverUrl && !imgError ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-outline">
              menu_book
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full">
          <span
            className={`font-label text-[10px] uppercase tracking-widest font-bold ${isAvailable ? "text-primary" : "text-error"}`}
          >
            {isAvailable ? "Available" : "Out of Stock"}
          </span>
        </div>
      </div>
      <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
        {book.title}
      </h3>
      <p className="font-body text-sm text-on-surface-variant">
        {book.author?.name || "Unknown Author"}
      </p>
    </div>
  );
};

const FilterBar = ({ categories, activeCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-surface-container-lowest px-5 py-3 rounded-lg font-label text-[11px] uppercase tracking-widest font-semibold flex items-center gap-3 hover:bg-surface-container-low transition-colors"
      >
        Filter: {activeCategory === "all" ? "All Categories" : activeCategory}
        <span className="material-symbols-outlined text-[18px]">
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-lg z-10 py-1">
          <button
            onClick={() => {
              onCategoryChange("all");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low"
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange(cat.name);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="..."
      >
        ‹
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`... ${page === currentPage ? "bg-primary text-white" : ""}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="..."
      >
        ›
      </button>
    </div>
  );
};

const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          per_page: 12,
          search: debouncedSearch || undefined,
        };
        if (activeCategory !== "all") {
          const selected = categories.find((c) => c.name === activeCategory);
          if (selected) params.category_id = selected.id;
        }
        const res = await getBooks(params);
        setBooks(res.data?.data || res.data || []);
        setTotalPages(res.data?.meta?.last_page || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [currentPage, activeCategory, debouncedSearch, categories]);

  const handleBorrow = async (book) => {
    try {
      await storeLoan({ book_id: book.id });
      setToast({
        message: "Borrow request submitted! Waiting for approval.",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to borrow book";
      setToast({ message: msg, type: "error" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  if (loading && books.length === 0) return <SkeletonLoading type="catalog" />;

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
            Member Catalog
          </h1>
          <p className="text-on-surface-variant max-w-lg">
            Explore our curated selection of archival masterpieces, rare
            editions, and contemporary classics.
          </p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface-container-lowest px-5 py-3 rounded-lg text-sm w-64 border-none focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {books.length === 0 && !loading ? (
        <div className="text-center py-20 text-on-surface-variant">
          No books found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={openModal} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <BookDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        book={selectedBook}
        onBorrow={handleBorrow}
      />

      {toast && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded shadow-lg ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
