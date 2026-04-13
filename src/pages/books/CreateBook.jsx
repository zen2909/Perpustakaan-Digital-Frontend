import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeBook } from "../../services/bookService";
import { getCategories } from "../../services/categoryService";
import { getAuthors } from "../../services/authorService";
import InputText from "../../components/form/InputText.jsx";
import InputFile from "../../components/form/InputFile.jsx";
import InputSelect from "../../components/form/InputSelect.jsx";
import MultiSelectDropdown from "../../components/form/MultiSelectDropdown.jsx";
import ButtonSubmit from "../../components/form/ButtonSubmit.jsx";
import { MdTitle } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  BookMarked,
  TextInitial,
  CalendarArrowUp,
  BookOpenText,
  BookOpenCheck,
} from "lucide-react";

export default function CreateBook() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [book, setBook] = useState({
    title: "",
    author_id: "",
    categories_id: [],
    publisher: "",
    published: "",
    description: "",
    isbn: "",
    pages: "",
    stock: "",
    image: null,
  });

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (file) => {
    setBook({
      ...book,
      image: file,
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await getAuthors();
      console.log("Response authors:", response.data.data);
      setAuthors(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
  }, []);

  const isValidPositiveInteger = (value) => {
    const num = Number(value);
    return !isNaN(num) && Number.isInteger(num) && num > 0;
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !book.title ||
      !book.author_id ||
      !book.categories_id.length === 0 ||
      !book.publisher ||
      !book.published ||
      !book.isbn ||
      !book.pages ||
      !book.stock
    ) {
      alert("Harap isi semua field yang wajib diisi");
      return;
    }

    if (!isValidPositiveInteger(book.pages)) {
      alert("Pages harus diisi dengan angka positif (contoh: 100)");
      return;
    }

    // Validasi stock
    if (!isValidPositiveInteger(book.stock)) {
      alert("Stock harus diisi dengan angka positif (contoh: 5)");
      return;
    }

    // Validasi published (tahun)
    const year = Number(book.published);
    const currentYear = new Date().getFullYear();
    if (
      !isValidPositiveInteger(book.published) ||
      year < 1900 ||
      year > currentYear
    ) {
      alert(`Published year harus diisi tahun antara 1900 - ${currentYear}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", book.title.trim());
      formData.append("author_id", book.author_id);
      book.categories_id.forEach((categoryId) => {
        formData.append("categories_id[]", categoryId);
      });
      formData.append("publisher", book.publisher.trim());
      formData.append("published_year", book.published.trim());
      formData.append("description", book.description.trim());
      formData.append("isbn", book.isbn.trim());
      formData.append("pages", book.pages.trim());
      formData.append("stock", book.stock.trim());
      if (book.image) {
        formData.append("cover_image", book.image);
      }
      console.log("Data book sebelum submit:", book);

      await storeBook(formData); // <- ganti store dengan storeBook

      alert("Book berhasil ditambahkan");
      navigate("/books");
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
        alert("Error detail: " + JSON.stringify(error.response.data, null, 2));
      } else {
        alert(
          "Book gagal ditambahkan: " + (error.message || "Terjadi kesalahan"),
        );
      }
    }
  };

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white rounded-lg shadow-md p-6"
      >
        <InputText
          name="title"
          type="text"
          label="Title"
          placeholder="Book title"
          icon={<MdTitle className="w-6 h-6" />}
          onChange={handleChange}
          value={book.title} // <- ganti data.name
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <InputSelect
              options={authors.map((author) => ({
                value: author.id,
                label: author.name,
              }))}
              name="author_id"
              label="Author"
              placeholder="Pilih penulis"
              onChange={handleChange}
              value={book.author_id}
              required
            />
            <InputText
              name="publisher"
              type="text"
              label="Publisher"
              placeholder="Publisher name"
              icon={<HiOutlineOfficeBuilding className="w-6 h-6" />}
              onChange={handleChange}
              value={book.publisher} // <- ganti data.publisher
              required
            />
            <InputText
              name="published"
              type="number"
              label="Published"
              placeholder="Published year"
              icon={<CalendarArrowUp className="w-6 h-6" />}
              onChange={handleChange}
              value={book.published} // <- ganti data.birth_year
              required
            />
            <InputText
              name="description"
              type="text"
              label="Description"
              placeholder="description"
              icon={<TextInitial className="w-6 h-6" />}
              onChange={handleChange}
              value={book.description}
            />
          </div>
          <div>
            <MultiSelectDropdown
              label="Categories"
              options={categoryOptions}
              value={book.categories_id}
              onChange={(selectedIds) =>
                setBook({ ...book, categories_id: selectedIds })
              }
              placeholder="Pilih kategori"
              required
            />

            <InputText
              name="isbn"
              type="text"
              label="ISBN"
              placeholder="ISBN number"
              icon={<BookMarked className="w-6 h-6" />}
              onChange={handleChange}
              value={book.isbn}
              required
            />
            <InputText
              name="pages"
              type="number"
              label="Pages"
              placeholder="amount of pages"
              icon={<BookOpenText className="w-6 h-6" />}
              onChange={handleChange}
              value={book.pages}
              required
            />
            <InputText
              name="stock"
              type="number"
              label="Stock"
              placeholder="amount of stock"
              icon={<BookOpenCheck className="w-6 h-6" />}
              onChange={handleChange}
              value={book.stock}
              required
            />
          </div>
        </div>

        <InputFile
          name="cover_image"
          type="file"
          label="Cover image"
          onFileChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
        />

        <ButtonSubmit label="Simpan" />
      </form>
    </div>
  );
}
