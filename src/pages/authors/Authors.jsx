// src/pages/authors/AuthorsPage.jsx
import React, { useState, useEffect } from "react";
import {
  getAuthors,
  storeAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorPhotoUrl,
} from "../../services/authorService";
import SkeletonLoading from "../../components/ui/SkeletonLoading";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    nationality: "",
    birth_year: "",
    photo: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await getAuthors();
      const data = res.data?.data || res.data || [];
      setAuthors(data);
      setFilteredAuthors(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data penulis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredAuthors(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, authors]);

  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
  const paginatedAuthors = filteredAuthors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewPhoto(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (author = null) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({
        name: author.name || "",
        biography: author.biography || "",
        nationality: author.nationality || "",
        birth_year: author.birth_year || "",
        photo: null,
      });
      setPreviewPhoto(getAuthorPhotoUrl(author.photo));
    } else {
      setEditingAuthor(null);
      setFormData({
        name: "",
        biography: "",
        nationality: "",
        birth_year: "",
        photo: null,
      });
      setPreviewPhoto(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    setFormData({
      name: "",
      biography: "",
      nationality: "",
      birth_year: "",
      photo: null,
    });
    setPreviewPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      if (formData.biography)
        submitData.append("biography", formData.biography);
      if (formData.nationality)
        submitData.append("nationality", formData.nationality);
      if (formData.birth_year)
        submitData.append("birth_year", formData.birth_year);
      if (formData.photo) submitData.append("photo", formData.photo);

      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, submitData);
        showToast("Penulis berhasil diperbarui", "success");
      } else {
        await storeAuthor(submitData);
        showToast("Penulis berhasil dibuat", "success");
      }
      fetchAuthors();
      closeModal();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Operasi gagal";
      showToast(msg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus penulis ini?")) return;
    try {
      await deleteAuthor(id);
      showToast("Penulis berhasil dihapus", "success");
      fetchAuthors();
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus penulis", "error");
    }
  };

  if (loading) return <SkeletonLoading type="authors" />;
  if (error) return <div className="p-4 md:p-10 text-error">{error}</div>;

  return (
    <div className="p-4 md:p-10 min-h-screen">
      {/* Header dengan search dan tombol New Entry - responsif */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-end gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary mb-1 md:mb-2 tracking-tight">
            Author Management
          </h2>
          <p className="text-sm text-on-surface-variant">
            Manage the voices behind the collection.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search authors..."
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
              New Author
            </span>
          </button>
        </div>
      </div>

      {/* Tabel Author - scroll horizontal di mobile */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <section>
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">
              Authors
            </h3>
            <span className="ml-auto text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold bg-surface-container-low px-2 py-1 rounded-full">
              {filteredAuthors.length} Total
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Photo
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Name
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Nationality
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Birth Year
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                      Biography
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
                  {paginatedAuthors.map((author) => (
                    <tr
                      key={author.id}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-surface-container-high">
                          {author.photo ? (
                            <img
                              src={getAuthorPhotoUrl(author.photo)}
                              alt={author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm">
                                person
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <span className="font-bold text-on-surface text-sm md:text-base">
                          {author.name}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-on-surface-variant text-sm">
                        {author.nationality || "—"}
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-on-surface-variant text-sm">
                        {author.birth_year || "—"}
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <p className="text-on-surface-variant text-sm line-clamp-2 max-w-[150px] md:max-w-[200px]">
                          {author.biography || "—"}
                        </p>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                        <span className="bg-secondary-container text-on-secondary-container text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {author.books_count ?? author.books?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openModal(author)}
                            className="p-1 md:p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-base md:text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(author.id)}
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
                  {paginatedAuthors.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 md:px-6 py-10 md:py-12 text-center text-on-surface-variant"
                      >
                        No authors found. Click "New Author" to create one.
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

      {/* Modal Create/Edit Author (responsif) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-surface-container-low">
              <h3 className="text-lg md:text-xl font-bold font-headline text-primary">
                {editingAuthor ? "Edit Author" : "Create Author"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              {/* form fields unchanged, but padding inside adjusted */}
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
                  placeholder="Full name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-2 md:p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Indonesian"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Birth Year
                  </label>
                  <input
                    type="number"
                    name="birth_year"
                    value={formData.birth_year}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-2 md:p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. 1975"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-surface-container-low border-none rounded-lg p-2 md:p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Brief biography..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Photo
                </label>
                <div className="relative border-2 border-dashed border-outline-variant rounded-xl p-4 hover:bg-surface-container-low hover:border-primary/30 transition-all flex flex-col sm:flex-row items-center justify-center gap-4 cursor-pointer">
                  <input
                    type="file"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {previewPhoto ? (
                    <img
                      src={previewPhoto}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-outline">
                      upload_file
                    </span>
                  )}
                  <p className="text-xs text-on-surface-variant">
                    {previewPhoto ? "Change photo" : "Upload photo (JPG, PNG)"}
                  </p>
                </div>
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
                  {editingAuthor ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification - responsif */}
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

export default AuthorsPage;
