import { useNavigate } from "react-router-dom";
import { buttonConfig } from "../../config/buttonConfig";
export default function ButtonUi({ type, route, id, onClick, label }) {
  const config = buttonConfig[type];
  const Icon = config.icon;
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "create") {
      navigate(route);
    } else if (type === "edit") {
      navigate(route.replace(":id", id));
    } else if (type === "delete") {
      onClick(id);
    }
  };

  const changeLabel = () => {
    if (type === "create") {
      return (
        <>
          <div
            className={`flex items-center justify-center gap-2 ${config.bgcolor} ${config.bghover} ${config.textcolor} hover:text-white transition-all duration-200 rounded-md p-2`}
          >
            <Icon className={`w-6 h-6 `} />
            <span className={`text-md font-inter font-semibold`}>{label}</span>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            className={`flex items-center justify-center gap-2 ${config.bgcolor} ${config.bghover} ${config.textcolor} hover:text-gray-100 transition-all duration-200 rounded-md p-2`}
          >
            <Icon className={`w-6 h-6`} />
          </div>
        </>
      );
    }
  };

  return <button onClick={handleClick}>{changeLabel()}</button>;
}
