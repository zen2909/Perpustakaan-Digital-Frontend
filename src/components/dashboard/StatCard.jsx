import { cardConfig } from "../../config/statCard";
export default function StatCard({ type }) {
  const config = cardConfig[type];

  const Icon = config.icon;

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full mx-auto rounded-xl">
        <div className="w-full h-44 bg-white bg-center object-cover rounded-lg border border-gray-300 shadow-sm">
          <div className="flex flex-col h-full gap-1">
            <div className="grid-grid-rows-2">
              <div className="flex items-end justify-center mt-6">
                <div
                  className={`flex justify-center items-center w-16 h-16 rounded-xl ${config.bgcolor}`}
                >
                  <Icon className={`w-10 h-10 ${config.iconcolor}`} />
                </div>
              </div>
              <span className="flex items-center justify-center text-3xl font-jakarta text-slate-500">
                5
              </span>
            </div>
            <div className="flex items-center justify-center text-xl font-jakarta text-gray-500">
              {config.label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
