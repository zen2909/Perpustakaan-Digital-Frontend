import { Routes, Route } from "react-router-dom";

import Authors from "../pages/authors/Authors";
import CreateAuthors from "../pages/authors/CreateAuthors";
import EditAuthors from "../pages/authors/EditAuthors";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Layout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/authors" element={<Authors />} />

        <Route path="/authors/create" element={<CreateAuthors />} />

        <Route path="/authors/edit/:id" element={<EditAuthors />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
