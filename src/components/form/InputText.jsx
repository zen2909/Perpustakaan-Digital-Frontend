export default function InputText({
  type,
  name,
  label,
  placeholder,
  icon,
  onChange,
  value,
  required,
}) {
  return (
    <>
      <label
        htmlFor={type}
        className="block text-md font-medium font-inter text-slate-700 bg-white pt-2 pb-2 "
      >
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-md bg-white">
        <span className="bg-white text-gray-400 p-2">{icon}</span>
        <input
          className="text-sm placeholder:text-md placeholder:text-gray-400 block w-full p-2 focus:outline-none focus:border-gray-400"
          type="text"
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          required={required}
        />
      </div>
    </>
  );
}
