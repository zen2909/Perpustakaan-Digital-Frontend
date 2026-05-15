import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";

import LoginPage from "../pages/auth/LoginPage";
import Register from "../pages/auth/Register";

// Lazy load untuk halaman lainnya
const AdminDashboard = lazy(() => import("../pages/dashboard/AdminDashboard"));
const MemberDashboard = lazy(
  () => import("../pages/dashboard/MemberDashboard"),
);
const Authors = lazy(() => import("../pages/authors/Authors"));
// const CreateAuthor = lazy(() => import("../pages/authors/CreateAuthor"));
// const EditAuthor = lazy(() => import("../pages/authors/EditAuthor"));
const Books = lazy(() => import("../pages/books/Books"));
const Catalog = lazy(() => import("../pages/books/Catalog"));
// const CreateBook = lazy(() => import("../pages/books/CreateBook"));
// const EditBook = lazy(() => import("../pages/books/EditBook"));
const Categories = lazy(() => import("../pages/categories/Categories"));
// const CreateCategories = lazy(
//   () => import("../pages/categories/CreateCategories"),
// );
// const EditCategories = lazy(() => import("../pages/categories/EditCategories"));
const Loans = lazy(() => import("../pages/loans/Loans"));
const MyLoans = lazy(() => import("../pages/loans/MyLoans"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/authors" element={<Authors />} />
        {/* <Route path="/authors/create" element={<CreateAuthor />} />
          <Route path="/authors/edit/:id" element={<EditAuthor />} /> */}

        <Route path="/books" element={<Books />} />
        <Route path="/catalog" element={<Catalog />} />
        {/* <Route path="/books/create" element={<CreateBook />} />
          <Route path="/books/edit/:slug" element={<EditBook />} /> */}

        <Route path="/categories" element={<Categories />} />
        {/* <Route path="/categories/create" element={<CreateCategories />} />
          <Route path="/categories/edit/:slug" element={<EditCategories />} /> */}

        <Route path="/loans" element={<Loans />} />
        <Route path="/my-loans" element={<MyLoans />} />
        <Route path="/logs" element={<h1>Logs</h1>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
