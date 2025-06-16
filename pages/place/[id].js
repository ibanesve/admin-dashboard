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
      if (!error) setPlace(data)
      setLoading(false)
    }
    fetchPlace()
  }, [id])

  if (loading) return <p style={styles.loading}>Loading...</p>
  if (!place) return <p style={styles.notFound}>Place not found</p>

  return (
    <div style={styles.page}>
      {place.image_url && (
        <div style={styles.bannerContainer}>
          <img src={place.image_url} alt={place.name} style={styles.banner} />
        </div>
      )}
      <div style={styles.content}>
        <h1 style={styles.title}>{place.name}</h1>
        <p style={styles.category}>{place.category}</p>
        <p style={styles.description}>{place.description}</p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    fontFamily: 'system-ui, sans-serif',
    color: '#333',
    lineHeight: 1.6,
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  notFound: {
    padding: '2rem',
    textAlign: 'center',
    color: '#aa0000',
    fontWeight: 'bold',
  },
  bannerContainer: {
    width: '100%',
    maxHeigh
