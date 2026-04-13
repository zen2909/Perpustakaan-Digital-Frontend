import { useNavigate, useLocation } from "react-router-dom";
import { Book } from "lucide-react";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlinePerson, MdOutlineLibraryAdd } from "react-icons/md";
import { TbCategoryPlus, TbLogs } from "react-icons/tb";

export default function Sidebar({ username, email }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { path: "/dashboard", icon: AiOutlineHome, label: "Dashboard" },
    { path: "/authors", icon: MdOutlinePerson, label: "Authors" },
    { path: "/books", icon: Book, label: "Books" },
    { path: "/categories", icon: TbCategoryPlus, label: "Categories" },
    { path: "/loans", icon: MdOutlineLibraryAdd, label: "Loans" },
    { path: "/logs", icon: TbLogs, label: "Logs" },
  ];

  return (
    <div className="flex min-h-full flex-col items-start justify-center bg-white shadow-lg is-drawer-close:w-20 is-drawer-open:w-64">
      {/* Sidebar content here */}
      <ul className="menu w-full grow gap-3">
        <li className="pt-4 pb-2">
          <div className="flex items-center gap-x-2 hover:bg-white">
            <img
              className="w-12 h-12 rounded-full object-cover is-drawer-close:w-10 is-drawer-close:h-10 transition-all duration-300 ring-blue-300 ring-offset-base-100 ring-2 ring-offset-2"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
              alt="avatar"
            />
            <div>
              <h1 className="text-lg font-semibold font-jakarta capitalize is-drawer-close:hidden">
                {username}
              </h1>

              <p className="text-md text-gray-500 font-inter is-drawer-close:hidden">
                {email}
              </p>
            </div>
          </div>
        </li>
        {/* List item */}
        {pages.map((item) => (
          <li key={item.path} className="px-2">
            <div
              className={`px-2 ${location.pathname === item.path ? "bg-blue-300 text-white" : "hover:bg-blue-300 hover:text-white"} transition-all duration-200"`}
            >
              <button
                onClick={() => navigate(item.path)}
                className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300"
              >
                <item.icon className="w-5 h-5 is-drawer-close:mx-auto" />
                <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                  {item.label}
                </span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
