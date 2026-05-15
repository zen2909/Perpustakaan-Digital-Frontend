// src/components/ui/PageLoader.jsx
import React from "react";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-on-surface-variant font-medium">
          Loading page...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
