import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createAuthor } from "../../services/authorService"

function CreateAuthors() {

  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault()

    await createAuthor({ name })

    navigate("/authors")
  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Create Author
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Author name"
          className="border p-2 w-full"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>

      </form>

    </div>

  )
}

export default CreateAuthors