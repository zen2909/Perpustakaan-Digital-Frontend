import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  icon = null,
  className = "",
}) => {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`archival-gradient w-full py-4 rounded-lg text-white font-bold tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          {icon && (
            <span className="material-symbols-outlined text-lg">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
