import { GoSidebarCollapse } from "react-icons/go";
export default function Navbar({ title }) {
  return (
    <nav className="navbar w-full bg-sky-50">
      <label
        htmlFor="my-drawer-4"
        aria-label="open sidebar"
        className="btn btn-square btn-ghost hover:bg-blue-300"
      >
        {/* Sidebar toggle icon */}
        <GoSidebarCollapse className="w-4 h-4 my-1.5 inline-block" />
      </label>
      <div className="px-4">{title}</div>
    </nav>
  );
}
