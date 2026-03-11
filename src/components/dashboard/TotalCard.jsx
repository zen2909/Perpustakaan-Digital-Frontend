import { cardConfig } from "../../config/totalCard";

export default function TotalCard({ type }) {
  const config = cardConfig[type];

  const Icon = config.icon;
  return (
    <div
      className={`flex w-full overflow-hidden ${config.bgcolor} dark:bg-gray-800 rounded-md hover:scale-110 transition-all duration-200`}
    >
      <div className="flex justify-center items-center w-20">
        <Icon className={`w-12 h-12 ${config.iconcolor}`} />
      </div>
      <div className="w-2/3 p-4 md:p-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white font-montserrat">
          {config.label}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-poppins">
          100 Loans
        </p>
      </div>
    </div>
  );
}
