import { IoLibraryOutline } from "react-icons/io5";
import { BookCheck, BookAlert } from "lucide-react";
import { MdOutlineToday, MdOutlineCalendarMonth } from "react-icons/md";

export const cardConfig = {
  totalBookLoans: {
    label: "Total Book Loans",
    icon: IoLibraryOutline,
    bgcolor: "bg-orange-100",
    iconcolor: "text-orange-500",
  },
  activeLoans: {
    label: "Total Active Loans",
    icon: BookCheck,
    bgcolor: "bg-green-100",
    iconcolor: "text-green-500",
  },
  overdueLoans: {
    label: "Overdue Loans",
    icon: BookAlert,
    bgcolor: "bg-red-100",
    iconcolor: "text-red-500",
  },
  finesToday: {
    label: "Total Fines Today",
    icon: MdOutlineToday,
    bgcolor: "bg-purple-100",
    iconcolor: "text-purple-500",
  },
  finesMonth: {
    label: "Total Fines This Month",
    icon: MdOutlineCalendarMonth,
    bgcolor: "bg-blue-100",
    iconcolor: "text-blue-500",
  },
};
