import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ title, data }) {
  console.log("Data yang diterima Chart:", data);
  console.log("Tipe data:", typeof data);
  console.log("Apakah array?", Array.isArray(data));
  if (Array.isArray(data) && data.length > 0) {
    console.log("Sample data pertama:", data[0]);
    console.log("Key yang tersedia:", Object.keys(data[0]));
  }
  return (
    <div className="font-poppins text-slate-700">
      <div className="bg-sky-300 p-2 rounded-md shadow-md mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div
        style={{ width: "100%", height: 400 }}
        className="pt-6 pb-6 pl-6 pr-6 bg-white rounded-md shadow-md "
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
