import { Book } from "lucide-react";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlinePerson, MdOutlineLibraryAdd } from "react-icons/md";
import { TbCategoryPlus, TbLogs } from "react-icons/tb";

export default function Sidebar({ username, email }) {
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
              <h1 className="text-lg font-semibold font-jakarta capitalize dark:text-white is-drawer-close:hidden">
                {username}
              </h1>

              <p className="text-md text-gray-500 font-inter dark:text-gray-400 is-drawer-close:hidden">
                {email}
              </p>
            </div>
          </div>
        </li>
        {/* List item */}
        <li className="px-2">
          <div className="px-2 hover:bg-blue-300 hover:text-white transition-all duration-200">
            <button className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300">
              <AiOutlineHome className="w-5 h-5 is-drawer-close:mx-auto" />
              <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                Homepage
              </span>
            </button>
          </div>
        </li>

        <li className="px-2">
          <div className="px-2 hover:bg-blue-300 hover:text-white transition-all duration-200">
            <button className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300">
              <MdOutlinePerson className="w-5 h-5 is-drawer-close:mx-auto" />
              <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                Authors
              </span>
            </button>
          </div>
        </li>
        <li className="px-2">
          <div className="px-2 hover:bg-blue-300 hover:text-white transition-all duration-200">
            <button className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300">
              <TbCategoryPlus className="w-5 h-5 is-drawer-close:mx-auto" />
              <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                Categories
              </span>
            </button>
          </div>
        </li>
        <li className="px-2">
          <div className="px-2 hover:bg-blue-300 hover:text-white transition-all duration-200">
            <button className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300">
              <Book className="w-5 h-5 is-drawer-close:mx-auto" />
              <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                Books
              </span>
            </button>
          </div>
        </li>
        <li className="px-2">
          <div className="px-2 hover:bg-blue-300 hover:text-white transition-all duration-200">
            <button className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300">
              <MdOutlineLibraryAdd className="w-5 h-5 is-drawer-close:mx-auto" />
              <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                Loans
              </span>
            </button>
          </div>
        </li>
        <li className="px-2">
          <div className="px-2 hover:bg-blue-300 hover:text-white transition-all duration-200">
            <button className="flex items-center justify-start w-full h-11 px-3 is-drawer-close:w-11 is-drawer-close:h-11 is-drawer-close:p-0 is-drawer-close:justify-center is-drawer-close:mx-auto transition-all duration-300">
              <TbLogs className="w-5 h-5 is-drawer-close:mx-auto" />
              <span className="font-sans text-md is-drawer-close:hidden ml-3 transition-all duration-300">
                Logs
              </span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}
