import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdOutlineAdd } from "react-icons/md";

export const buttonConfig = {
  create: {
    icon: MdOutlineAdd,
    bgcolor: "bg-sky-200",
    textcolor: "text-sky-600",
    bghover: "hover:bg-sky-500",
  },
  edit: {
    label: null,
    icon: RiEdit2Line,
    bgcolor: "bg-yellow-200",
    textcolor: "text-yellow-600",
    bghover: "hover:bg-yellow-400",
  },
  delete: {
    label: null,
    icon: RiDeleteBin2Line,
    bgcolor: "bg-red-200",
    textcolor: "text-red-600",
    bghover: "hover:bg-red-500",
  },
  submit: {
    label: null,
    icon: null,
    bgcolor: "bg-sky-200",
    textcolor: "text-sky-600",
    bghover: "hover:bg-sky-500",
  },
};
