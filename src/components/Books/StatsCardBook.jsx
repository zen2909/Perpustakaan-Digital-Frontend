import React from "react";

const StatsCardBook = ({
  icon,
  label,
  value,
  trend,
  trendIcon = "trending_up",
  trendColor = "primary",
}) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
      <span className="material-symbols-outlined absolute -top-2 -right-2 text-6xl text-primary/5 rotate-12 transition-transform group-hover:rotate-0">
        {icon}
      </span>
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-headline font-extrabold text-primary">
        {value}
      </p>
      {trend && (
        <p
          className={`text-[10px] font-bold mt-2 flex items-center gap-1 text-${trendColor}`}
        >
          <span className="material-symbols-outlined text-xs">{trendIcon}</span>{" "}
          {trend}
        </p>
      )}
    </div>
  );
};

export default StatsCardBook;
