import api from "./api";

export const getCategories = () => {
  return api.get("/categories");
};

export const getCategoryBySlug = (slug) => {
  return api.get(`/categories/${slug}`);
};

export const storeCategory = (data) => {
  return api.post("/categories", data);
};

export const updateCategoryBySlug = (slug, data) => {
  return api.put(`/categories/${slug}`, data);
};

export const deleteCategory = (slug) => {
  return api.delete(`/admin/categories/${slug}`);
};
