import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PlacePage() {
  const router = useRouter()
  const { id } = router.query
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchPlace = async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching place:', error)
      } else {
        setPlace(data)
      }
      setLoading(false)
    }

    fetchPlace()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!place) return <p>Place not found.</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{place.name}</h1>
      <img src={place.image_url} alt={place.name} style={{ maxWidth: '100%' }} />
      <p>{place.description}</p>
      <p><strong>Category:</strong> {place.category}</p>
    </div>
  )
}
