import React from "react";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(15,118,110,0.08)]">
      <div className="mb-8">
        <h2 className="font-headline text-xl font-bold text-on-surface mb-1">
          {title}
        </h2>
        <p className="text-sm text-on-surface-variant">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
