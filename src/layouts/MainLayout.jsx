import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useState, useEffect } from "react";
import { getMe } from "../services/authService";

export default function MainLayout() {
  const location = useLocation();
  const [user, setUser] = useState("");

  const getTitle = () => {
    const pathname = location.pathname;

    switch (true) {
      case pathname.startsWith("/authors"):
        return "Authors Management";
      case pathname.startsWith("/books"):
        return "Books Management";
      case pathname.startsWith("/categories"):
        return "Categories Management";
      case pathname.startsWith("/loans"):
        return "Loans Management";
      case pathname === "/logs":
        return "Logs Management";
      case pathname === "/dashboard":
        return "Dashboard";
      default:
        return {};
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <Navbar title={getTitle()} />

        <div className="py-6 px-6 bg-sky-50 min-h-screen">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {user && <Sidebar username={user.name} email={user.email} />}
      </div>
    </div>
  );
}
