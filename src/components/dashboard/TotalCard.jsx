import { cardConfig } from "../../config/totalCard";

export default function TotalCard({ type, value }) {
  const config = cardConfig[type];

  const Icon = config.icon;
  return (
    <div className={`flex w-full overflow-hidden ${config.bgcolor} rounded-md`}>
      <div className="flex justify-center items-center w-20">
        <Icon className={`w-12 h-12 ${config.iconcolor}`} />
      </div>
      <div className="w-2/3 p-4 md:p-4">
        <h1 className={`text-xl font-bold text-slate-700 font-poppins`}>
          {config.label}
        </h1>
        <p
          className={`mt-2 text-sm ${config.textcolor} dark:text-gray-400 font-poppins`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
