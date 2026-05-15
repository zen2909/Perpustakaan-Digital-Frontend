// src/components/member/MemberStatsSection.jsx
import React from "react";

const MemberStatsSection = ({
  activeLoans = 0,
  pendingDues = 0,
  dueDate = "3 days",
  onSettleNow,
}) => {
  return (
    <section className="grid grid-cols-12 gap-6">
      {/* Active Loans Card */}
      <div className="col-span-12 md:col-span-5 bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group transition-all duration-300">
        <div className="relative z-10">
          <p className="text-label text-on-surface-variant mb-2">
            Active Loans
          </p>
          <h2 className="text-6xl font-extrabold text-primary font-headline">
            {activeLoans}
          </h2>
          <p className="text-sm text-on-surface-variant mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            Next return due in {dueDate}
          </p>
        </div>
        <span className="material-symbols-outlined absolute -top-4 -right-4 text-9xl text-primary/5 select-none pointer-events-none group-hover:rotate-12 transition-transform duration-500">
          auto_stories
        </span>
      </div>

      {/* Pending Dues Card */}
      <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
        <div>
          <p className="text-label text-on-surface-variant mb-2">
            Pending Dues
          </p>
          <h2 className="text-4xl font-bold text-on-surface font-headline">
            Rp {pendingDues.toLocaleString("id-ID")}
          </h2>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Cleared on 12/04
          </span>
          <button
            onClick={onSettleNow}
            className="text-xs font-bold text-primary uppercase tracking-widest hover:underline transition-all"
          >
            Settle Now
          </button>
        </div>
      </div>

      {/* Account Status Card */}
      <div className="col-span-12 md:col-span-3 bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-center items-center text-center">
        <div className="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center mb-4">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
        <p className="text-label text-on-primary/70 mb-1">Account Status</p>
        <h3 className="font-headline font-bold text-lg">Verified Member</h3>
      </div>
    </section>
  );
};

export default MemberStatsSection;
