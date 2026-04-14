import React from "react";

const Checkbox = ({ id, label, checked, onChange, disabled = false }) => {
  return (
    <div className="flex items-center space-x-3 ml-1">
      <div className="relative flex items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-5 h-5 rounded bg-surface-container-low border-none text-primary focus:ring-primary/20 focus:ring-2 transition-all cursor-pointer disabled:opacity-50"
        />
      </div>
      <label
        htmlFor={id}
        className={`text-sm font-medium text-on-surface-variant cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
