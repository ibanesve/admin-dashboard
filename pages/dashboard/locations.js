import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LocationsPage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
  name: '',
  description: '',
  category: '',
  image: null
})
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('places').select('*')
    if (error) setError(error.message)
    else setPlaces(data)
    setLoading(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 const handleSubmit = async (e) => {
  e.preventDefault()

  let image_url = ''

  // Upload image if selected
  if (form.image) {
    const fileExt = form.image.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('places-images')
      .upload(filePath, form.image)

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message)
      return
    }

    const { data: publicUrl } = supabase.storage
      .from('places-images')
      .getPublicUrl(filePath)

    image_url = publicUrl.publicUrl
  }

  // Insert place with image_url
  const { error } = await supabase.from('places').insert([
    {
      name: form.name,
      description: form.description,
      category: form.category,
      image_url
    }
  ])

  if (error) {
    alert('Error adding place: ' + error.message)
  } else {
    setForm({ name: '', description: '', category: '', image: null })
    fetchPlaces()
  }
}


  const handleEditClick = (place) => {
    setEditingId(place.id)
    setEditForm(place)
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from('places')
      .update(editForm)
      .eq('id', editingId)
    if (error) {
      alert('Error updating: ' + error.message)
    } else {
      setEditingId(null)
      fetchPlaces()
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this place?')
    if (!confirmDelete) return
    const { error } = await supabase.from('places').delete().eq('id', id)
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      fetchPlaces()
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Places</h1>

      {/* Add New Place Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>Add New Place</h3>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        /><br />
            <input
  type="file"
  accept="image/*"
  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
/><br />
        <button type="submit">Add Place</button>
      </form>

      {/* Places Table */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && places.length === 0 && <p>No places found.</p>}
      {!loading && places.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                {editingId === place.id ? (
                  <>
                    <td>
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                      />
                    </td>

                 <td>
  {place.image_url ? (
    <img src={place.image_url} alt={place.name} width="100" />
  ) : (
    'No image'
  )}
</td>
                    <td>
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{place.name}</td>
                    <td>{place.description}</td>
                    <td>{place.category}</td>
                    <td>
                      <button onClick={() => handleEditClick(place)}>Edit</button>
                      <button onClick={() => handleDelete(place.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
