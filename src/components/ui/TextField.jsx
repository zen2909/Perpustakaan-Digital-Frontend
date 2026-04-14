import React from "react";

const TextField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  autoComplete = "off",
  error = "",
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1"
      >
        {label}
      </label>
      <div className="relative flex items-center ghost-border transition-all rounded-lg bg-surface-container-low">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 text-outline text-xl z-10">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full bg-transparent border-none rounded-lg py-3.5 ${icon ? "pl-12" : "pl-4"} pr-4 text-sm text-on-surface placeholder-outline focus:ring-0 focus:outline-none`}
        />
      </div>
      {error && <p className="text-xs text-error ml-1">{error}</p>}
    </div>
  );
};

export default TextField;
