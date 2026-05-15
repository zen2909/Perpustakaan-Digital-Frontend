import React from "react";

const FloatingActivity = () => {
  return (
    <div className="fixed bottom-8 right-8 w-80 bg-surface/80 backdrop-blur-xl border border-teal-900/5 rounded-2xl shadow-2xl p-5 z-40 hidden xl:block">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Live Archives
        </h5>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-sm text-primary">
              add_box
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">
              New Volume Indexed
            </p>
            <p className="text-[10px] text-on-surface-variant/70 leading-tight">
              "Digital Humanities Vol 4" added to History section by Curator
              Marks.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-sm text-on-secondary-container">
              swap_horiz
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Status Updated</p>
            <p className="text-[10px] text-on-surface-variant/70 leading-tight">
              "Architectural Archetypes" moved to Low Stock alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingActivity;
