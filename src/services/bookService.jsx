import api from "./api";

const FILE_BASE_URL = "http://localhost:8000";

export const getBooks = () => {
  return api.get("/books");
};

export const getBook = (id) => {
  return api.get(`/books/${id}`);
};

export const storeBook = (data) => {
  return api.post("/books", data);
};

export const updateBook = (id, data) => {
  return api.put(`/books/${id}`, data);
};

export const deleteBook = (id) => {
  return api.delete(`/admin/books/${id}`);
};

export const getBookcoverUrl = (coverPath) => {
  if (!coverPath) return null;

  if (coverPath.startsWith("http://") || coverPath.startsWith("https://")) {
    return coverPath;
  }
  return `${FILE_BASE_URL}/${coverPath}`;
};
