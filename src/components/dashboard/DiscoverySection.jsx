// src/components/member/DiscoverySection.jsx
import React, { useState } from "react";

const categories = ["History", "Philosophy", "Design"];

const DiscoverySection = ({ onCategoryChange, onExplore }) => {
  const [activeCategory, setActiveCategory] = useState("History");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-label text-primary">Discovery</p>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight">
            Expand Your Horizon
          </h2>
        </div>
        <div className="flex gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative w-full h-80 rounded-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
        <img
          alt="Library interior"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7a--HqNEOGLMWC3WyUSRUsdAW_qKg7jb-kKIJG8IBWH-3eLsutoKk1LwfNumbvyRFaTd3PgvgBlHkxgMdlq_btgBS1tfUuQhMAtQWgVV9vzH49Pi-MtMrf7pivlKATKkvPzpLqP2M8-Vm6iQ-oe6hlhh7Yq6BY2Cr4CuJBq1ed1uIZEQDF5P_DllIjgi-KMORAyCp8u4B79zx6r05qHW4cnppEVf_TpNWNu0vqTlr_2p0wJ_KYSFclcIt8QzYtQUHPJFeqSw5bw"
        />
        <div className="absolute inset-0 z-20 p-10 flex flex-col justify-end">
          <h3 className="text-white text-4xl font-headline font-extrabold max-w-xl leading-tight mb-4">
            The Architecture of Modern Thought
          </h3>
          <p className="text-white/80 max-w-md text-sm leading-relaxed mb-6">
            Explore the curated collection of mid-century philosophical essays
            and architectural blueprints from the private estate of the
            Curators.
          </p>
          <button
            onClick={onExplore}
            className="w-fit primary-gradient text-on-primary px-8 py-3 rounded-lg font-bold text-sm"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverySection;
