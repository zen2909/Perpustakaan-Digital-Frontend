export default function InputSelect({ options, placeholder, label, ...props }) {
  return (
    <>
      <label className="block text-md font-medium font-inter text-slate-700 bg-white pt-2 pb-2 ">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-md bg-white">
        <select {...props} className="select w-full ml-2">
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, idx) => {
            const value = typeof opt === "object" ? opt.value : opt;
            const label = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={idx} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
