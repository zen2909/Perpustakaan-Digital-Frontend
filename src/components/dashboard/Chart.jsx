import React, { useState } from "react";

const Chart = ({ monthlyLoans = [], monthlyFines = [] }) => {
  const [chartType, setChartType] = useState("loans"); // 'loans' or 'fines'

  // Gunakan data dari API jika ada, else data dummy
  const hasLoansData = monthlyLoans.length > 0;
  const hasFinesData = monthlyFines.length > 0;

  const labels = hasLoansData
    ? monthlyLoans.map((item) => item.month || item.month_name)
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const loansValues = hasLoansData
    ? monthlyLoans.map((item) => item.total || item.count || 0)
    : [40, 55, 85, 45, 65, 75];

  const finesValues = hasFinesData
    ? monthlyFines.map((item) => item.total || item.amount || 0)
    : [120, 200, 350, 180, 420, 290];

  const currentValues = chartType === "loans" ? loansValues : finesValues;
  const maxValue = Math.max(...currentValues, 1);

  // Normalisasi nilai ke persentase (maks 100%)
  const normalizedValues = currentValues.map((val) => (val / maxValue) * 100);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-headline font-bold text-lg">
            {chartType === "loans" ? "Loans Over Time" : "Fines Over Time"}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {chartType === "loans"
              ? "Archival circulation trends for the current quarter"
              : "Monthly fine accumulation trends"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("loans")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              chartType === "loans"
                ? "bg-surface-container-low text-primary"
                : "text-on-surface-variant"
            }`}
          >
            Loans
          </button>
          <button
            onClick={() => setChartType("fines")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              chartType === "fines"
                ? "bg-surface-container-low text-primary"
                : "text-on-surface-variant"
            }`}
          >
            Fines
          </button>
        </div>
      </div>
      <div className="h-64 flex items-end gap-4 w-full px-2">
        {normalizedValues.map((val, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col justify-end gap-2 items-center group"
          >
            <div
              className="w-full bg-primary-container/20 rounded-t-sm transition-all group-hover:bg-primary/40"
              style={{ height: `${val}%` }}
            >
              <div
                className="w-full bg-primary rounded-t-sm transition-all h-full"
                style={{ height: `${val}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              {labels[idx]}
            </span>
          </div>
        ))}
      </div>
      {chartType === "fines" && (
        <div className="mt-4 text-xs text-on-surface-variant text-center">
          Total fines collected: $
          {currentValues.reduce((a, b) => a + b, 0).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default Chart;
