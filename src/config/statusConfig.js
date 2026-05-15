export const statusConfig = {
  approved: {
    label: "Approved",
    icon: "check_circle",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
    pulse: false,
  },
  pending: {
    label: "Pending",
    icon: "hourglass_top",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-500",
    pulse: true,
  },
  borrowed: {
    label: "Borrowed",
    icon: "menu_book",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-500",
    pulse: false,
  },
  overdue: {
    label: "Overdue",
    icon: "error",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    dotColor: "bg-rose-500",
    pulse: true,
  },
  returned: {
    label: "Returned",
    icon: "check_circle",
    bgColor: "bg-slate-50",
    textColor: "text-slate-500",
    borderColor: "border-slate-200",
    dotColor: "bg-slate-400",
    pulse: false,
  },
};

export const getStatusConfig = (status) => {
  return (
    statusConfig[status] || {
      label: status || "Unknown",
      icon: "help",
      bgColor: "bg-gray-50",
      textColor: "text-gray-500",
      borderColor: "border-gray-200",
      dotColor: "bg-gray-400",
      pulse: false,
    }
  );
};
