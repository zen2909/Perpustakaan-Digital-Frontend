// src/components/books/FilterBar.jsx
import React, { useState } from "react";

const FilterBar = ({
  categories = [],
  activeCategory,
  onFilterChange,
  onSortChange,
}) => {
  const [sortBy, setSortBy] = useState("recent");

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (onSortChange) onSortChange(value);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 px-2">
      <button
        onClick={() => onFilterChange("All Genres")}
        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
          activeCategory === "All Genres"
            ? "bg-white text-primary shadow-sm ring-1 ring-primary/10"
            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
        }`}
      >
        All Genres
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
            activeCategory === cat
              ? "bg-white text-primary shadow-sm ring-1 ring-primary/10"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          {cat}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
          Sort By:
        </span>
        <select
          value={sortBy}
          onChange={handleSort}
          className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 cursor-pointer"
        >
          <option value="recent">Recently Added</option>
          <option value="title">Title A-Z</option>
          <option value="stock">Stock Level</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
