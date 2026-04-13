import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeCategory } from "../../services/categoryService.jsx";
import InputText from "../../components/form/InputText.jsx";
import ButtonSubmit from "../../components/form/ButtonSubmit.jsx";
import { IoText } from "react-icons/io5";
import { LuLetterText } from "react-icons/lu";
export default function CreateCategories() {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

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

      await storeCategory(formData);
      alert("Category berhasil ditambahkan");
      navigate("/categories");
    } catch (error) {
      alert(
        "Category gagal ditambahkan " + (error.message || "Terjadi kesalahan"),
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
