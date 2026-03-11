import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors, deleteAuthor } from "../../services/authorService";

function Authors() {
  const [authors, setAuthors] = useState([]);

  const fetchAuthors = async () => {
    try {
      const response = await getAuthors();

      setAuthors(response.data.data);
    } catch (error) {
      console.error(error);
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
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Authors</h1>

        <Link
          to="/authors/create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Author
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {authors.map((author) => (
            <tr key={author.id} className="border-t">
              <td className="p-2">{author.id}</td>
              <td className="p-2">{author.name}</td>

              <td className="p-2 flex gap-2">
                <Link
                  to={`/authors/edit/${author.id}`}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(author.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Authors;
