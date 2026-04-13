import { CheckCheck, Info } from "lucide-react";
import { RiDeleteBin2Line } from "react-icons/ri";

export const loanButtonConfig = {
  pending: {
    button: [
      {
        icon: CheckCheck,
        bgcolor: "bg-green-500",
        iconcolor: "text-white",
      },
      {
        icon: Info,
        bgcolor: "bg-yellow-500",
        iconcolor: "text-white",
      },
      {
        icon: RiDeleteBin2Line,
      },
    ],
  },
};
