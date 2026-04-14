import React, { useState } from "react";

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  forgotPasswordLink = true,
  required = false,
  error = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ml-1">
        <label
          htmlFor={id}
          className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant"
        >
          {label}
        </label>
        {forgotPasswordLink && (
          <a
            href="#"
            className="text-[11px] font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-wider"
          >
            Forgot Password?
          </a>
        )}
      </div>
      <div className="relative flex items-center ghost-border transition-all rounded-lg bg-surface-container-low">
        <span className="material-symbols-outlined absolute left-4 text-outline text-xl z-10">
          lock
        </span>
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          required={required}
          className="w-full bg-transparent border-none rounded-lg py-3.5 pl-12 pr-12 text-sm text-on-surface placeholder-outline focus:ring-0 focus:outline-none"
        />
        <button
          type="button"
          className="absolute right-4 text-outline hover:text-on-surface-variant transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          <span className="material-symbols-outlined text-xl">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-error ml-1">{error}</p>}
    </div>
  );
};

export default PasswordField;
