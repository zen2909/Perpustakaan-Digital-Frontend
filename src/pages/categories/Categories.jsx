import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../../services/categoryService";
import TableData from "../../components/table/TableData";
import ButtonUi from "../../components/ui/ButtonUi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setloading] = useState(true);

  const categoryColumns = [
    { key: "index", type: "text", label: "No" },
    { key: "name", type: "text", label: "Name" },
    { key: "description", type: "bio", label: "Description" },
  ];

  const buttonData = [
    {
      type: "edit",
      route: "/categories/edit/:slug",
    },
    {
      type: "delete",
      onClick: (slug) => handleDelete(slug),
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setloading(true);
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm("Delete this category?")) {
      await deleteCategory(slug);

      fetchCategories();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end p-4">
        <ButtonUi
          type="create"
          route="/categories/create"
          label="Add Category"
        />
      </div>
      <TableData
        data={categoryColumns}
        values={categories}
        buttons={buttonData}
        loading={loading}
      />
    </div>
  );
}
