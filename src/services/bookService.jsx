import api from "./api";

const FILE_BASE_URL = "http://192.168.1.16:8000";

export const getBooks = (params = {}) => {
  return api.get("/books", { params });
};

export const getBook = (id) => {
  return api.get(`/books/${id}`);
};

export const storeBook = (data) => {
  return api.post("/books", data);
};

export const updateBook = (slug, data) => {
  return api.post(`/books/${slug}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteBook = (id) => {
  return api.delete(`/admin/books/${id}`);
};

export const getBookcoverUrl = (coverPath) => {
  if (!coverPath) return null;
  if (coverPath.startsWith("http")) return coverPath;
  // Hapus 'public/' jika ada
  let clean = coverPath.replace(/^public\//, "");
  // Pastikan path memiliki 'books/'
  if (!clean.startsWith("books/")) {
    clean = `books/${clean}`;
  }
  return `${FILE_BASE_URL}/storage/${clean}`;
};

export const getTotalBooks = () => {
  return api.get("/books/total-books");
};

export const getBooksMonthlyGrowth = () => {
  return api.get("/books/monthly-growth");
};
