// src/components/layout/Header.jsx
import React from "react";
import { MdNotifications, MdHistory, MdSettings, MdMenu } from "react-icons/md";

const Header = ({ user, onMenuClick }) => {
  return (
    <header className="sticky top-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-md flex justify-between items-center px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        {/* Tombol menu untuk mobile & tablet (lg ke bawah) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
        >
          <MdMenu size={24} />
        </button>
        {/* Logo untuk mobile & tablet */}
        <span className="font-bold text-primary font-headline text-lg lg:hidden">
          NusantaraReads
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant transition-colors">
          <MdNotifications className="text-xl" />
        </button>
        <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant transition-colors">
          <MdHistory className="text-xl" />
        </button>
        <button className="hover:bg-surface-container-high rounded-full p-2 text-on-surface-variant transition-colors">
          <MdSettings className="text-xl" />
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden bg-primary-container ml-1 ring-2 ring-primary/10">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-on-surface hidden md:inline-block">
          {user?.name || "Guest"}
        </span>
      </div>
    </header>
  );
};

export default Header;
