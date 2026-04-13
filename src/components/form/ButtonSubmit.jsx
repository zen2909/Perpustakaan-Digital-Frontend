import { buttonConfig } from "../../config/buttonConfig";
export default function ButtonUi({ label }) {
  const config = buttonConfig.submit;
  return (
    <button type="Submit">
      <div
        className={`flex items-center justify-center gap-2 ${config.bgcolor} ${config.bghover} ${config.textcolor} hover:text-white transition-all duration-200 rounded-md p-2 mt-4`}
      >
        <span className={`text-xl`}>{label}</span>
      </div>
    </button>
  );
}
