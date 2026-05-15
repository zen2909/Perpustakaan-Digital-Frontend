// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineLibraryBooks,
  MdOutlineCategory,
  MdOutlineHistoryEdu,
  MdOutlineBook,
  MdListAlt,
  MdOutlineBookmark,
  MdOutlinePerson,
  MdOutlineLogout,
  MdClose,
} from "react-icons/md";
import { logout } from "../../services/authService";

const Sidebar = ({ role, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const adminMenu = [
    {
      path: "/admin/dashboard",
      icon: <MdOutlineDashboard />,
      label: "Dashboard",
    },
    { path: "/books", icon: <MdOutlineLibraryBooks />, label: "Books" },
    { path: "/categories", icon: <MdOutlineCategory />, label: "Categories" },
    { path: "/authors", icon: <MdOutlineHistoryEdu />, label: "Authors" },
    { path: "/loans", icon: <MdOutlineBook />, label: "Loans" },
    { path: "/logs", icon: <MdListAlt />, label: "Activity Log" },
  ];

  const librarianMenu = [
    {
      path: "/admin/dashboard",
      icon: <MdOutlineDashboard />,
      label: "Dashboard",
    },
    { path: "/books", icon: <MdOutlineLibraryBooks />, label: "Books" },
    { path: "/categories", icon: <MdOutlineCategory />, label: "Categories" },
    { path: "/authors", icon: <MdOutlineHistoryEdu />, label: "Authors" },
    { path: "/loans", icon: <MdOutlineBook />, label: "Loans" },
  ];

  const memberMenu = [
    {
      path: "/member/dashboard",
      icon: <MdOutlineDashboard />,
      label: "Dashboard",
    },
    { path: "/catalog", icon: <MdOutlineLibraryBooks />, label: "Catalog" },
    { path: "/my-loans", icon: <MdOutlineBookmark />, label: "My Loans" },
  ];

  let navItems = [];
  switch (role) {
    case "admin":
      navItems = adminMenu;
      break;
    case "librarian":
      navItems = librarianMenu;
      break;
    case "member":
      navItems = memberMenu;
      break;
    default:
      navItems = adminMenu;
  }

  return (
    <aside className="w-64 bg-surface-container-low flex flex-col h-full overflow-y-auto shadow-lg">
      {/* Header Sidebar: Title sejajar dengan tombol close */}
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-primary font-headline">
            NusantaraReads
          </span>
          <span className="font-headline tracking-[0.05em] uppercase text-[9px] font-semibold text-on-surface-variant">
            Library Management
          </span>
        </div>
        {/* Tombol close untuk mobile & tablet */}
        <button
          onClick={onClose}
          className="p-1 text-on-surface-variant hover:text-primary transition-colors lg:hidden"
        >
          <MdClose size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-4 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg transition-all font-headline tracking-[0.05em] uppercase text-xs ${
                isActive
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-white/50"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 p-4 pt-4 border-t border-outline-variant">
        <NavLink
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/50 transition-all"
        >
          <span className="text-lg">
            <MdOutlinePerson />
          </span>
          <span className="font-headline tracking-[0.05em] uppercase text-xs">
            Profile
          </span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-3 px-4 rounded-lg text-error hover:bg-error/5 transition-all w-full text-left"
        >
          <span className="text-lg">
            <MdOutlineLogout />
          </span>
          <span className="font-headline tracking-[0.05em] uppercase text-xs">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
