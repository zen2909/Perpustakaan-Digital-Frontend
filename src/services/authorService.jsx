import api from "./api";

export const getAuthors = () => {
  return api.get("/authors");
};

export const getAuthor = (id) => {
  return api.get(`/authors/${id}`);
};

export const createAuthor = (data) => {
  return api.post("/authors", data);
};

export const updateAuthor = (id, data) => {
  return api.put(`/authors/${id}`, data);
};

export const deleteAuthor = (id) => {
  return api.delete(`/admin/authors/${id}`);
};
