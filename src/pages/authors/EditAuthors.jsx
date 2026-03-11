import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAuthor, updateAuthor } from "../../services/authorService"

function EditAuthors(){

  const { id } = useParams()

  const [name, setName] = useState("")

  const navigate = useNavigate()

  const fetchAuthor = async () => {

    const response = await getAuthor(id)

    setName(response.data.name)
  }

  useEffect(()=>{

    fetchAuthor()

  }, [])

  const handleSubmit = async (e) => {

    e.preventDefault()

    await updateAuthor(id,{ name })

    navigate("/authors")
  }

  return(

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Edit Author
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          className="border p-2 w-full"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>

      </form>

    </div>
  )
}

export default EditAuthors