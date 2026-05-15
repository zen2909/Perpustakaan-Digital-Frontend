import React, { useState, useEffect } from "react";
import { getAuthors } from "../../services/authorService";
import { getCategories } from "../../services/categoryService";
import {
  storeBook,
  updateBook,
  getBookcoverUrl,
} from "../../services/bookService";

const BookFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    author_id: "",
    publisher: "",
    published_year: "",
    pages: "",
    description: "",
    stock: "",
    categories_id: [],
    cover_image: null,
  });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      fetchAuthorsAndCategories();
      if (isEdit && initialData) {
        populateForm(initialData);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const fetchAuthorsAndCategories = async () => {
    try {
      const [authorsRes, categoriesRes] = await Promise.all([
        getAuthors(),
        getCategories(),
      ]);
      const authorsData = authorsRes.data?.data || authorsRes.data || [];
      const categoriesData =
        categoriesRes.data?.data || categoriesRes.data || [];
      setAuthors(authorsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load authors/categories", err);
    }
  };

  const populateForm = (book) => {
    setFormData({
      title: book.title || "",
      isbn: book.isbn || "",
      author_id: book.author_id || "",
      publisher: book.publisher || "",
      published_year: book.published_year || "",
      pages: book.pages || "",
      description: book.description || "",
      stock: book.stock || "",
      categories_id: book.categories?.map((cat) => cat.id) || [],
      cover_image: null,
    });
    if (book.cover_image) {
      setPreviewUrl(getBookcoverUrl(book.cover_image));
    } else {
      setPreviewUrl(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      isbn: "",
      author_id: "",
      publisher: "",
      published_year: "",
      pages: "",
      description: "",
      stock: "",
      categories_id: [],
      cover_image: null,
    });
    setPreviewUrl(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, files, options, multiple } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, cover_image: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else if (name === "categories_id" && multiple) {
      // Handle multi-select: ambil semua opsi yang dipilih
      const selectedValues = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => Number(opt.value));
      setFormData((prev) => ({ ...prev, categories_id: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi slug untuk edit
    if (isEdit && (!initialData || !initialData.slug)) {
      setError("Book slug is missing. Please refresh the page and try again.");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "categories_id") {
          formData.categories_id.forEach((id) =>
            submitData.append("categories_id[]", id),
          );
        } else if (key === "cover_image" && formData.cover_image) {
          submitData.append("cover_image", formData.cover_image);
        } else if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });

      let response;
      if (isEdit) {
        response = await updateBook(initialData.slug, submitData);
      } else {
        response = await storeBook(submitData);
      }

      // Pengecekan response yang aman (axios response selalu memiliki status)
      if (response && (response.status === 200 || response.status === 201)) {
        if (onSuccess) onSuccess();
        onClose();
      } else if (response && response.data && response.data.success === true) {
        // Alternatif jika backend mengembalikan success flag
        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Save error:", err);
      let errorMsg = "Failed to save book. ";
      if (err.response) {
        if (err.response.status === 404) {
          errorMsg =
            "Book not found. It may have been deleted. Please refresh the page.";
        } else if (err.response.status === 422) {
          const errors = err.response.data.errors;
          errorMsg += Object.values(errors).flat().join(", ");
        } else {
          errorMsg +=
            err.response.data?.message ||
            `Server error: ${err.response.status}`;
        }
      } else if (err.message) {
        errorMsg += err.message;
      } else {
        errorMsg += "Unknown error occurred";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Sidebar decoration */}
        <div className="md:w-1/3 bg-primary-container p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span
              className="material-symbols-outlined text-4xl mb-4"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isEdit ? "edit_note" : "add_circle"}
            </span>
            <h3 className="text-2xl font-extrabold font-headline leading-tight mb-2">
              {isEdit ? "Edit Volume" : "Curate New Volume"}
            </h3>
            <p className="text-on-primary-container text-xs leading-relaxed opacity-80">
              {isEdit
                ? "Update metadata for this archival entry."
                : "Add a new book to the digital archives. Ensure all metadata is accurate for future retrieval."}
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">
              Catalog Standards
            </div>
            <ul className="text-[10px] space-y-2 opacity-80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">check</span>{" "}
                Unique ISBN required
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">check</span>{" "}
                High-res cover required
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">check</span>{" "}
                Category verification
              </li>
            </ul>
          </div>
          <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/5 rotate-12">
            menu_book
          </span>
        </div>

        {/* Form */}
        <div className="md:w-2/3 p-8 bg-surface-container-lowest flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline font-bold text-on-surface">
              Metadata Entry
            </h4>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                  Volume Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Enter book title"
                />
              </div>

              {/* ISBN & Publisher */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="978-0-123456-47-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Publisher name"
                  />
                </div>
              </div>

              {/* Author & Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    Author *
                  </label>
                  <select
                    name="author_id"
                    value={formData.author_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    Categories *
                  </label>
                  <select
                    name="categories_id"
                    multiple
                    value={formData.categories_id.map(String)}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    style={{ minHeight: "100px" }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1">
                    Hold{" "}
                    <kbd className="px-1 bg-surface-container-high rounded">
                      Ctrl
                    </kbd>{" "}
                    (Windows) /{" "}
                    <kbd className="px-1 bg-surface-container-high rounded">
                      Cmd
                    </kbd>{" "}
                    (Mac) to select multiple
                  </p>
                </div>
              </div>

              {/* Year, Pages, Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    Published Year
                  </label>
                  <input
                    type="number"
                    name="published_year"
                    value={formData.published_year}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Number of pages"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Brief description of the book"
                ></textarea>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">
                  Cover Image
                </label>
                <div className="relative border-2 border-dashed border-outline-variant rounded-xl p-6 hover:bg-surface-container-low hover:border-primary/30 transition-all flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    name="cover_image"
                    onChange={handleChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="max-h-32 rounded-lg shadow-sm mb-2"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">
                      upload_file
                    </span>
                  )}
                  <p className="text-xs text-on-surface-variant font-medium">
                    {previewUrl ? "Change image" : "Drag and drop or "}
                    <span className="text-primary font-bold">browse</span>
                  </p>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-surface-container-highest text-on-surface-variant py-3 rounded-lg font-bold text-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Saving..." : isEdit ? "Update Book" : "Save Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
