import { useState, useEffect } from "react";
import { X, ImageUp } from "lucide-react";

export default function InputFile({
  name,
  label,
  onFileChange,
  accept = "image/*",
  required = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("Harap upload file gambar (PNG, JPG, JPEG)");
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setSelectedFile(file);

    // Buat preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);

    // Kirim file ke parent component
    if (onFileChange) {
      onFileChange(file);
    }
  };

  const handleRemoveFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <>
      <label
        htmlFor={name}
        className="block text-md font-medium font-inter text-slate-700 bg-white pt-2 pb-2 "
      >
        {label}
      </label>
      {selectedFile && preview ? (
        <div className="grid grid-rows-[auto_1fr] w-fit gap-2">
          <div className="flex w-48 item-center border border-gray-300 bg-white rounded-md">
            <span className="w-full p-2 font-inter">{selectedFile.name}</span>
            <span
              onClick={handleRemoveFile}
              className="flex items-center justify-center p-2 rounded-tr-md rounded-br-md border-gray-400 bg-red-200 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-200"
            >
              <X />
            </span>
          </div>
          <img src={preview} alt="preview" className="w-48 h-48 object-cover" />
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex items-center border border-gray-200 rounded-md bg-white"
        >
          <label
            htmlFor={name}
            className="flex flex-col items-center w-full p-5 mx-auto text-center bg-white border border-gray-200 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-md"
          >
            <ImageUp className="w-8 h-8 text-gray-400" />

            <p className="mt-2 text-md tracking-wide font-semibold font-inter text-slate-500 dark:text-slate-400">
              Image File
            </p>

            <p className="mt-2 text-xs tracking-wide font-inter text-gray-500 dark:text-gray-400">
              Upload or darg & drop your file PNG, JPG, JPEG.
            </p>
            <input
              id={name}
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileUpload}
              required={required && !selectedFile}
            />
          </label>
        </div>
      )}
    </>
  );
}
