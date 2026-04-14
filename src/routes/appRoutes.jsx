import { Routes, Route } from "react-router-dom";

import Authors from "../pages/authors/Authors";
import CreateAuthor from "../pages/authors/CreateAuthor";
import EditAuthor from "../pages/authors/EditAuthor";
import LoginPage from "../pages/auth/LoginPage";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Layout from "../layouts/MainLayout";
import Books from "../pages/books/Books";
import CreateBook from "../pages/books/CreateBook";
import EditBook from "../pages/books/EditBook";
import Categories from "../pages/categories/Categories";
import CreateCategories from "../pages/categories/CreateCategories";
import EditCategories from "../pages/categories/EditCategories";
import Loans from "../pages/loans/Loans";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/authors" element={<Authors />} />
        <Route path="/authors/create" element={<CreateAuthor />} />
        <Route path="/authors/edit/:id" element={<EditAuthor />} />

        <Route path="/books" element={<Books />} />
        <Route path="/books/create" element={<CreateBook />} />
        <Route path="/books/edit/:slug" element={<EditBook />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/create" element={<CreateCategories />} />
        <Route path="/categories/edit/:slug" element={<EditCategories />} />

        <Route path="/loans" element={<Loans />} />
        <Route path="/logs" element={<h1>Logs</h1>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
