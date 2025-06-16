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
    image: null,
    coordinates: { lat: '', lng: '' },
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
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      setForm({
        ...form,
        coordinates: {
          ...form.coordinates,
          [name]: value
        }
      })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  let image_url = ''

  try {
    if (form.image) {
      const fileExt = form.image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('places-images')
        .upload(filePath, form.image)

      if (uploadError) {
        console.error('Upload Error:', uploadError)
        alert('Upload error: ' + uploadError.message)
        return
      }

      const { data: publicUrlData, error: publicUrlError } = await supabase.storage
        .from('places-images')
        .getPublicUrl(filePath)

      if (publicUrlError) {
        console.error('Public URL error:', publicUrlError)
        alert('URL error: ' + publicUrlError.message)
        return
      }

      image_url = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('places').insert([
      {
        name: form.name,
        description: form.description,
        category: form.category,
        image_url: image_url,
        coordinates: {
          lat: parseFloat(form.coordinates.lat),
          lng: parseFloat(form.coordinates.lng),
        },
      },
    ])

    if (error) {
      console.error('Insert Error:', error)
      alert('Error saving to table: ' + error.message)
    } else {
      setForm({
        name: '',
        description: '',
        category: '',
        image: null,
        coordinates: { lat: '', lng: '' },
      })
      fetchPlaces()
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    alert('Unexpected error occurred')
  }
}


  const handleEditClick = (place) => {
    setEditingId(place.id)
    setEditForm(place)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      setEditForm({
        ...editForm,
        coordinates: {
          ...editForm.coordinates,
          [name]: value
        }
      })
    } else {
      setEditForm({ ...editForm, [name]: value })
    }
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

<form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
  <h3>Add New Place testing form here</h3>
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

  {/* ✅ Coordinates Inputs */}
 <input
  type="number"
  name="lat"
  placeholder="Latitude"
  value={form.coordinates.lat}
  onChange={handleChange}
  step="any"
/><br />

<input
  type="number"
  name="lng"
  placeholder="Longitude"
  value={form.coordinates.lng}
  onChange={handleChange}
  step="any"
/><br />



  {/* ✅ Optional test */}
  <p>🧭 Coordinate inputs should show above this line</p>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
  /><br />
  <button type="submit">Add Place</button>
</form>



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
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                {editingId === place.id ? (
                  <>
                    <td><input name="name" value={editForm.name} onChange={handleEditChange} /></td>
                    <td><textarea name="description" value={editForm.description} onChange={handleEditChange} /></td>
                    <td><input name="category" value={editForm.category} onChange={handleEditChange} /></td>
                   <input
  type="number"
  name="lat"
  placeholder="Latitude"
  value={form.lat}
  onChange={handleChange}
  step="any"
  required
/><br />

<input
  type="number"
  name="lng"
  placeholder="Longitude"
  value={form.lng}
  onChange={handleChange}
  step="any"
  required
/><br />

        
                    <td>{place.image_url ? <img src={place.image_url} alt={place.name} width="100" /> : 'No image'}</td>
                    <td>
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><a href={`/place/${place.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>{place.name}</a></td>
                    <td>{place.description}</td>
                    <td>{place.category}</td>
                    <td>{place.coordinates?.lat}</td>
                    <td>{place.coordinates?.lng}</td>
                    <td>{place.image_url ? <img src={place.image_url} alt={place.name} width="100" /> : 'No image'}</td>
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
