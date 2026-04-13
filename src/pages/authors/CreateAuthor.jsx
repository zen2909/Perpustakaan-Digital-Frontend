import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeAuthor } from "../../services/authorService.jsx";
import InputText from "../../components/form/InputText.jsx";
import InputFile from "../../components/form/InputFile.jsx";
import ButtonSubmit from "../../components/form/ButtonSubmit.jsx";
import { UserRoundPen, MapPin, Calendar, TextInitial } from "lucide-react";

export default function CreateAuthor() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    nationality: "",
    birth_year: "",
    biography: "",
    photo: null,
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (file) => {
    setData({
      ...data,
      photo: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.nationality || !data.birth_year) {
      alert("Harap isi semua field yang wajib diisi");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("nationality", data.nationality.trim());
      formData.append("birth_year", parseInt(data.birth_year.trim()));
      formData.append("biography", data.biography.trim());
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      await storeAuthor(formData);

      alert("Author berhasil ditambahkan");
      navigate("/authors");
    } catch (error) {
      console.error(error);
      alert(
        "Author gagal ditambahkan: " + (error.message || "Terjadi kesalahan"),
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
          icon={<UserRoundPen className="w-6 h-6" />}
          onChange={handleChange}
          value={data.name}
          required
        />
        <InputText
          name="nationality"
          type="text"
          label="Nationality"
          placeholder="Indonesia"
          icon={<MapPin className="w-6 h-6" />}
          onChange={handleChange}
          value={data.nationality}
          required
        />
        <InputText
          name="birth_year"
          type="text"
          label="Birth Year"
          placeholder="Birth Year"
          icon={<Calendar className="w-6 h-6" />}
          onChange={handleChange}
          value={data.birth_year}
          required
        />
        <InputText
          name="biography"
          type="text"
          label="Biography"
          placeholder="Biography"
          icon={<TextInitial className="w-6 h-6" />}
          onChange={handleChange}
          value={data.biography}
        />

        <InputFile
          name="photo"
          type="file"
          label="Photo"
          onFileChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
        />

        <ButtonSubmit label="Simpan" />
      </form>
    </div>
  );
}
