import ButtonUi from "../ui/ButtonUi";
import { useState } from "react";

function BioCell({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <p
      onClick={() => setExpanded(!expanded)}
      className={
        expanded
          ? "cursor-pointer max-w-xs mx-auto"
          : "cursor-pointer max-w-xs mx-auto truncate"
      }
    >
      {text}
    </p>
  );
}

function TableSkeleton() {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-8">
        <div className="w-full h-full rounded-lg animate-pulse flex items-center justify-center">
          <span className="loading loading-spinner text-blue-400"></span>
        </div>
      </td>
    </tr>
  );
}

export default function TableData({
  data = [],
  values = [],
  buttons = [],
  currentPage = 1,
  loading = false,
}) {
  const renderCell = (row, column, rowIndex) => {
    // Untuk kolom index
    if (column.key === "index") {
      const safeIndex = typeof rowIndex === "number" ? rowIndex : 0;
      const safePage =
        typeof currentPage === "number" && !isNaN(currentPage)
          ? Math.max(1, currentPage)
          : 1;
      const safePerPage =
        Array.isArray(values) && values.length > 0 ? values.length : 1;
      const result = safeIndex + 1 + (safePage - 1) * safePerPage;
      return !isNaN(result) ? result : safeIndex + 1;
    }

    // Ambil nilai berdasarkan key
    let value = row[column.key];

    // Tangani nilai yang null/undefined
    if (value === null || value === undefined) return "-";

    // Tangani objek (bukan array)
    if (typeof value === "object" && !Array.isArray(value)) {
      // Coba ambil properti 'name' jika ada
      if (value.name) return value.name;
      // Jika tidak, konversi ke JSON (hindari rendering langsung)
      return JSON.stringify(value);
    }

    // Tangani array
    if (Array.isArray(value)) {
      if (value.length === 0) return "-";
      // Jika array berisi objek, ambil properti 'name' lalu gabung
      if (value[0] && typeof value[0] === "object") {
        return value.map((item) => item.name).join(", ");
      }
      // Jika array berisi string/number, gabung langsung
      return value.join(", ");
    }

    // Sesuai tipe
    switch (column.type) {
      case "image":
        return value ? (
          <img
            src={value}
            alt={column.key}
            className="w-14 h-14 object-cover rounded-md"
          />
        ) : null;
      case "bio":
        return <BioCell text={value} />;
      default:
        // Pastikan value bukan objek (sudah ditangani di atas)
        return value;
    }
  };
  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-200">
                  <tr>
                    {data.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-4 py-3.5 text-md font-monserrat w-fit font-semibold text-center rtl:text-right text-slate-700"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-md font-monserrat w-fit font-semibold text-center rtl:text-right text-slate-700"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loading ? (
                    <TableSkeleton />
                  ) : values.length === 0 ? (
                    <tr>
                      <td
                        colSpan={data.length + 1}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    values.map((row, rowindex) => (
                      <tr key={row.id || rowindex}>
                        {data.map((column, colindex) => (
                          <td
                            key={colindex}
                            className="px-4 py-3.5 text-md font-monserrat w-fit text-center rtl:text-right text-slate-700 capitalize"
                          >
                            {renderCell(row, column, rowindex)}
                          </td>
                        ))}
                        <td className="flex justify-center items-center px-4 py-3.5 gap-3 text-md font-monserrat rtl:text-right text-slate-700 capitalize">
                          {buttons.map((button, index) => {
                            const id = row.id;
                            const slug = row.slug;
                            let route = button.route;

                            const identifier = slug || id;
                            if (route && id) {
                              route = route.replace(":id", id);
                            }
                            if (route && slug) {
                              route = route.replace(":slug", slug);
                            }
                            return (
                              <ButtonUi
                                key={index}
                                type={button.type}
                                id={identifier}
                                route={route}
                                onClick={
                                  button.onClick
                                    ? () => button.onClick(identifier)
                                    : undefined
                                }
                              />
                            );
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
