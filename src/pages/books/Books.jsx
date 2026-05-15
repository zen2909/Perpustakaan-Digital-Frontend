import React, { useState, useEffect } from "react";
import StatsCardBook from "../../components/books/StatsCardBook";
import FilterBar from "../../components/books/FilterBar";
import BookTable from "../../components/books/BookTable";
import BookFormModal from "../../components/books/BookFormModal";
import BookDetailModal from "../../components/books/BookDetailModal";
import SkeletonLoading from "../../components/ui/SkeletonLoading";
import {
  getBooks,
  deleteBook,
  getTotalBooks,
  getBooksMonthlyGrowth,
} from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import { getTotalActiveLoans } from "../../services/loanService";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statistik
  const [totalVolumes, setTotalVolumes] = useState(0);
  const [onLoan, setOnLoan] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10);

  // Filter & sort
  const [activeFilter, setActiveFilter] = useState("All Genres");
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  // Categories
  const [categories, setCategories] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const categoriesData = res.data?.data || res.data || [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalBooksRes, activeLoansRes, growthRes] = await Promise.all([
          getTotalBooks(),
          getTotalActiveLoans(),
          getBooksMonthlyGrowth(),
        ]);
        setTotalVolumes(totalBooksRes.data?.total || 0);
        setOnLoan(activeLoansRes.data?.total || 0);
        setMonthlyGrowth(growthRes.data?.growth || 0);
      } catch (err) {
        console.error("Stats error", err);
      }
    };
    fetchStats();
  }, []);

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      let categoryId = null;
      if (activeFilter !== "All Genres") {
        const selectedCat = categories.find((c) => c.name === activeFilter);
        categoryId = selectedCat?.id;
      }

      let sortByField = "created_at";
      let sortOrder = "desc";
      if (sortBy === "title") {
        sortByField = "title";
        sortOrder = "asc";
      } else if (sortBy === "stock") {
        sortByField = "stock";
        sortOrder = "desc";
      }

      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortByField,
        sort_order: sortOrder,
        search: searchTerm || undefined,
        category_id: categoryId || undefined,
      };

      const response = await getBooks(params);
      const data = response.data;
      setBooks(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, activeFilter, sortBy, searchTerm]);

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  const handleArchive = async (book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      try {
        await deleteBook(book.id);
        fetchBooks();
        const totalRes = await getTotalBooks();
        setTotalVolumes(totalRes.data?.total || 0);
      } catch (err) {
        console.error(err);
        alert("Failed to delete book");
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleModalSuccess = () => {
    fetchBooks();
  };

  const formattedBooks = books.map((book) => ({
    ...book,
    cover_image: book.cover_image,
    author_name: book.author?.name || "Unknown Author",
    category_name:
      book.categories?.map((c) => c.name).join(", ") || "Uncategorized",
  }));

  if (loading) return <SkeletonLoading type="books" />;
  if (error) return <div className="p-4 md:p-8 text-error">{error}</div>;

  const growthText =
    monthlyGrowth >= 0
      ? `+${monthlyGrowth}% this month`
      : `${monthlyGrowth}% this month`;
  const percentOnLoan = totalVolumes
    ? ((onLoan / totalVolumes) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header - responsive: turun ke kolom di mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 md:mb-10">
        <div>
          <h3 className="font-headline text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
            Book Management
          </h3>
        </div>
        <button
          onClick={() => {
            setEditingBook(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform text-sm md:text-base"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add
          </span>
          <span>Add New Book</span>
        </button>
      </div>

      {/* Stats Grid - responsif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        <StatsCardBook
          icon="menu_book"
          label="Total Volumes"
          value={totalVolumes.toLocaleString()}
          trend={growthText}
          trendIcon="trending_up"
          trendColor="primary"
        />
        <StatsCardBook
          icon="local_library"
          label="On Loan"
          value={onLoan.toLocaleString()}
          trend={`${percentOnLoan}% of total stock`}
          trendIcon="info"
          trendColor="on-surface-variant"
        />
        <StatsCardBook
          icon="history_edu"
          label="Recent Acquisitions"
          value="—"
          trend="Last 7 days"
          trendIcon="schedule"
          trendColor="primary"
        />
        <StatsCardBook
          icon="verified"
          label="Catalog Health"
          value="99.2%"
          trend="Optimal Status"
          trendIcon="check_circle"
          trendColor="primary"
        />
      </div>

      {/* Search dan Filter - responsive wrap */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search by title or ISBN..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex-1">
          <FilterBar
            categories={categories.map((c) => c.name)}
            activeCategory={activeFilter}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Tabel dengan overflow horizontal */}
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="min-w-[800px] md:min-w-0">
          <BookTable
            books={formattedBooks}
            onEdit={handleEditBook}
            onView={handleViewBook}
            onArchive={handleArchive}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        </div>
      </div>

      {/* Modals */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        initialData={editingBook}
      />
      <BookDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        book={selectedBook}
      />
    </div>
  );
};

export default BooksPage;
