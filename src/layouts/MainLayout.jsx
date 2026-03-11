import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useState, useEffect } from "react";
import { getMe } from "../services/authService";

export default function MainLayout() {
  const location = useLocation();
  const [user, setUser] = useState("");

  // Mapping title berdasarkan path
  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/authors":
        return "Authors Management";
      case "/books":
        return "Books Management";
      case "/categories":
        return "Categories Management";
      case "/loans":
        return "Loans Management";
      case "/logs":
        return "System Logs";
      default:
        return "Page Title";
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

        <div className="py-6 px-6 bg-sky-50">
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
