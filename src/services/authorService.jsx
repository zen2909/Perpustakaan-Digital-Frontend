import api from "./api";

const FILE_BASE_URL = "http://localhost:8000";

export const getAuthors = () => {
  return api.get("/authors");
};

export const getAuthor = (id) => {
  return api.get(`/authors/${id}`);
};

export const storeAuthor = (data) => {
  return api.post("/authors", data);
};

export const updateAuthor = (id, data) => {
  return api.put(`/authors/${id}`, data);
};

export const deleteAuthor = (id) => {
  return api.delete(`/admin/authors/${id}`);
};

export const getAuthorPhotoUrl = (photoPath) => {
  if (!photoPath) return null;

  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  return `${FILE_BASE_URL}/${photoPath}`;
};
