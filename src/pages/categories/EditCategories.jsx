import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  updateCategoryBySlug,
  getCategoryBySlug,
} from "../../services/categoryService.jsx";
import InputText from "../../components/form/InputText.jsx";
import ButtonSubmit from "../../components/form/ButtonSubmit.jsx";
import { IoText } from "react-icons/io5";
import { LuLetterText } from "react-icons/lu";
export default function EditCategories() {
  const { slug } = useParams();
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryBySlug(slug);

        const categoryData = response.data.data;
        setCategory({
          name: categoryData.name,
          description: categoryData.description,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [slug]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name || !category.description) {
      alert("Harap isi semua field yang wajib diisi");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", category.name.trim());
      formData.append("description", category.description.trim());
      formData.append("slug", slug);
      console.log("Updating category with slug:", slug);

      await updateCategoryBySlug(slug, formData);
      alert("Category berhasil diperbarui");
      navigate("/categories");
    } catch (error) {
      alert(
        "Category gagal diperbarui " + (error.message || "Terjadi kesalahan"),
      );
    }
  };

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white rounded-lg shadow-md p-6"
      >
        <InputText
          name="name"
          type="text"
          label="Name"
          placeholder="Name"
          icon={<IoText className="w-6 h-6" />}
          onChange={handleChange}
          value={category.name}
          required
        />
        <InputText
          name="description"
          type="text"
          label="Description"
          placeholder="Description"
          icon={<LuLetterText className="w-6 h-6" />}
          onChange={handleChange}
          value={category.description}
          required
        />

        <ButtonSubmit label="Simpan" />
      </form>
    </div>
  );
}
