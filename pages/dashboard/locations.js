import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LocationsPage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', category: '' })

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
    const { error } = await supabase.from('places').insert([form])
    if (error) {
      alert('Error adding place: ' + error.message)
    } else {
      setForm({ name: '', description: '' })
      fetchPlaces() // refresh the table
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Places</h1>

      {/* Add Place Form */}
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

        <button type="submit">Add Place</button>
      </form>

      {/* Table */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && places.length === 0 && <p>No places found.</p>}
      {!loading && places.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              {Object.keys(places[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                {Object.values(place).map((value, i) => (
                  <td key={i}>{value?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
