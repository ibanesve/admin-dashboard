import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LocationsPage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlaces = async () => {
      const { data, error } = await supabase.from('places').select('*')
      if (error) setError(error.message)
      else setPlaces(data)
      setLoading(false)
    }
    fetchPlaces()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Places</h1>
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
