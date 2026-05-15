// src/pages/categories/CategoriesPage.jsx
import React, { useState, useEffect } from "react";
import {
  getCategories,
  storeCategory,
  updateCategoryBySlug,
  deleteCategory,
} from "../../services/categoryService";
import SkeletonLoading from "../../components/ui/SkeletonLoading";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      const data = res.data?.data || res.data || [];
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, categories]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategoryBySlug(editingCategory.slug, formData);
        showToast("Kategori berhasil diperbarui", "success");
      } else {
        await storeCategory(formData);
        showToast("Kategori berhasil dibuat", "success");
      }
      fetchCategories();
      closeModal();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Operasi gagal";
      showToast(msg, "error");
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await deleteCategory(slug);
      showToast("Kategori berhasil dihapus", "success");
      fetchCategories();
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus kategori", "error");
    }
  };

  if (loading) return <SkeletonLoading type="categories" />;
  if (error) return <div className="p-4 md:p-10 text-error">{error}</div>;

  return (
    <div className="p-4 md:p-10 min-h-screen">
      {/* Header dengan search dan tombol New Entry - responsif */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-end gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary mb-1 md:mb-2 tracking-tight">
            Category Management
          </h2>
          <p className="text-sm text-on-surface-variant">
            Refine and organize the library's intellectual architecture.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Search input */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48 sm:w-64"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-white font-semibold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-sm font-semibold tracking-wide">
              New Entry
            </span>
          </button>
        </div>
      </div>

      {/* Tabel Kategori - scroll horizontal di mobile */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <section>
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">
              Categories
            </h3>
            <span className="ml-auto text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold bg-surface-container-low px-2 py-1 rounded-full">
              {filteredCategories.length} Total
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Name
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Description
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px] text-center">
                      Books
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {paginatedCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-teal-50 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm md:text-base">
                              menu_book
                            </span>
                          </div>
                          <span className="font-bold text-on-surface text-sm md:text-base">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <p className="text-on-surface-variant text-sm line-clamp-1 max-w-[150px] md:max-w-[200px]">
                          {cat.description || "—"}
                        </p>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {cat.books_count ?? cat.books?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openModal(cat)}
                            className="p-1 md:p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-base md:text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(cat.slug)}
                            className="p-1 md:p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-base md:text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 md:px-6 py-10 md:py-12 text-center text-on-surface-variant"
                      >
                        No categories found. Click "New Entry" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - responsif */}
            {totalPages > 1 && (
              <div className="px-4 md:px-6 py-3 md:py-4 flex flex-wrap justify-end items-center gap-2 border-t border-surface-container-low">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1 md:p-2 rounded-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">
                    chevron_left
                  </span>
                </button>
                <span className="text-xs md:text-sm text-on-surface-variant">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 md:p-2 rounded-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modal Create/Edit (sudah responsif) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-surface-container-low">
              <h3 className="text-lg md:text-xl font-bold font-headline text-primary">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-2 md:p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Philosophy"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-surface-container-low border-none rounded-lg p-2 md:p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Brief description..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-container transition-all"
                >
                  {editingCategory ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification - responsif posisi */}
      {toast && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center bg-white/85 backdrop-blur-xl p-3 md:p-4 rounded-xl shadow-xl border border-white/20 max-w-[90vw] md:max-w-sm">
          <div
            className={`w-1 h-8 rounded-full mr-3 md:mr-4 ${toast.type === "success" ? "bg-primary" : "bg-error"}`}
          ></div>
          <div className="mr-4 md:mr-6">
            <h5 className="text-[10px] md:text-xs font-bold text-on-surface uppercase tracking-widest">
              {toast.type === "success" ? "Success" : "Error"}
            </h5>
            <p className="text-xs md:text-sm text-on-surface-variant font-medium">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-base md:text-lg">
              close
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
