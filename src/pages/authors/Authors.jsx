import { useEffect, useState } from "react";
import { getAuthors, deleteAuthor } from "../../services/authorService";
import TableData from "../../components/table/TableData";
import ButtonUi from "../../components/ui/ButtonUi";
function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const authorColumns = [
    { key: "index", type: "text", label: "No" },
    { key: "name", type: "text", label: "Name" },
    { key: "photo", type: "image", label: "Photo" },
    { key: "biography", type: "bio", label: "Biography" },
    { key: "nationality", type: "text", label: "Nationality" },
    { key: "birth_year", type: "text", label: "Birth Year" },
  ];

  const buttonData = [
    {
      type: "edit",
      route: "/authors/edit/:id",
    },
    {
      type: "delete",
      onClick: (id) => handleDelete(id),
    },
  ];
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await getAuthors();
      console.log("authors response:", response.data.data[0]);
      setAuthors(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this author?")) {
      await deleteAuthor(id);

      fetchAuthors();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end p-4">
        <ButtonUi type="create" route="/authors/create" label="Add Author" />
      </div>
      <TableData
        data={authorColumns}
        values={authors}
        buttons={buttonData}
        loading={loading}
      />
    </div>
  );
}

export default Authors;
