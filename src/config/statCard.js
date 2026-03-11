import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { SiBookstack } from "react-icons/si";
import { FaUserPen } from "react-icons/fa6";

export const cardConfig = {
  members: {
    label: "Members",
    icon: BsFillPeopleFill,
    iconcolor: "text-blue-500",
    bgcolor: "bg-blue-200",
  },
  books: {
    label: "Books",
    icon: SiBookstack,
    iconcolor: "text-pink-500",
    bgcolor: "bg-pink-200",
  },
  authors: {
    label: "Authors",
    icon: FaUserPen,
    iconcolor: "text-green-500",
    bgcolor: "bg-green-200",
  },
  categories: {
    label: "Categories",
    icon: BiSolidCategoryAlt,
    iconcolor: "text-red-500",
    bgcolor: "bg-red-200",
  },
};
