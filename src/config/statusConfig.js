import {
  IoCheckmarkDone,
  IoReturnUpBack,
  IoTimeOutline,
} from "react-icons/io5";
import { PiHandArrowDownLight } from "react-icons/pi";
import { IoIosCloseCircleOutline } from "react-icons/io";

export const statusConfig = {
  pending: {
    label: "Pending",
    icon: IoTimeOutline,
    bgcolor: "bg-yellow-100",
    textcolor: "text-yellow-500",
  },
  approved: {
    label: "Approved",
    icon: IoCheckmarkDone,
    bgcolor: "bg-green-100",
    textcolor: "text-green-500",
  },
  borrowed: {
    label: "Borrowed",
    icon: PiHandArrowDownLight,
    bgcolor: "bg-blue-100",
    textcolor: "text-blue-500",
  },
  returned: {
    label: "Returned",
    icon: IoReturnUpBack,
    bgcolor: "bg-gray-100",
    textcolor: "text-gray-500",
  },
  overdue: {
    label: "Overdue",
    icon: IoIosCloseCircleOutline,
    bgcolor: "bg-red-100",
    textcolor: "text-red-500",
  },
};
