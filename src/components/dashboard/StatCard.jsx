import React from "react";

const StatCard = ({
  icon,
  label,
  value,
  subText,
  subTextColor = "primary",
}) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
      <span className="material-symbols-outlined absolute -top-2 -right-2 text-6xl text-primary/5 group-hover:text-primary/10 transition-colors">
        {icon}
      </span>
      <span className="font-label text-[10px] tracking-widest uppercase font-bold text-on-surface-variant block mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold font-headline text-primary">
          {value}
        </span>
        <span className={`text-xs font-bold text-${subTextColor}`}>
          {subText}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
