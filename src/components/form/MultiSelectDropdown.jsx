import Select from "react-dropdown-select";

export default function MultiSelectDropdown({
  options, // array of {value: id, label: name}
  value, // array of selected values (IDs)
  onChange, // function (selectedIds) => void
  placeholder,
  label,
}) {
  // Konversi value (array of IDs) ke format yang dibutuhkan Select
  const selectedValues = options.filter((opt) => value.includes(opt.value));

  const handleChange = (newValues) => {
    // Ambil array of IDs dari hasil selection
    const selectedIds = newValues.map((item) => item.value);
    onChange(selectedIds);
  };

  return (
    <>
      <label className="block text-md font-medium font-inter text-slate-700 bg-white pt-2 pb-2 ">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-md bg-white w-full">
        <div className="w-full">
          <Select
            options={options}
            values={selectedValues}
            onChange={handleChange}
            placeholder={placeholder}
            multi={true}
            closeOnSelect={true}
            searchable={true}
            clearable={true}
          />
        </div>
      </div>
    </>
  );
}
