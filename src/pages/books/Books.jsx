import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../../services/bookService";
import TableData from "../../components/table/TableData";
import ButtonUi from "../../components/ui/ButtonUi";

export default function Books() {
  const [books, setBooks] = useState([]);

  const bookColumns = [
    { key: "index", type: "text", label: "No" },
    { key: "title", type: "text", label: "Title" },
    { key: "cover_image", type: "image", label: "Cover" },
    { key: "author", type: "text", label: "Author" },
    { key: "categories", type: "text", label: "Categories" },
    { key: "publisher", type: "text", label: "Publisher" },
    { key: "published_year", type: "text", label: "Published" },
  ];

  const buttonData = [
    {
      type: "edit",
      route: "/books/edit/:slug",
    },
    {
      type: "delete",
      onClick: (slug) => handleDelete(slug),
    },
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      console.log("Full response:", response.data);
      console.log("First book:", response.data.data[0]);
      setBooks(response.data.data);
    } catch (err) {
      // ← gunakan parameter err
      console.error("Error fetching books:", err);
      if (err.response) {
        console.log("Response status:", err.response.status);
        console.log("Response data:", err.response.data);
        alert(
          `Server error: ${err.response.status} - ${err.response.data.message || "Terjadi kesalahan"}`,
        );
      } else {
        alert("Gagal memuat data buku. Periksa koneksi atau server.");
      }
    }
  };

  const handleDelete = async (slug) => {
    if (confirm("Delete this book?")) {
      await deleteBook(slug);

      fetchBooks();
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-end p-4">
        <ButtonUi type="create" route="/books/create" label="Add Book" />
      </div>
      <TableData data={bookColumns} values={books} buttons={buttonData} />
    </div>
  );
}
