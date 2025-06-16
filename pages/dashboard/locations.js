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
    lat: '',
    lng: '',
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

    try {
      if (form.image) {
        const fileExt = form.image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('places-images')
          .upload(filePath, form.image)

        if (uploadError) {
          alert('Upload error: ' + uploadError.message)
          return
        }

        const {
          data: publicUrlData,
          error: publicUrlError,
        } = await supabase.storage
          .from('places-images')
          .getPublicUrl(filePath)

        if (publicUrlError) {
          alert('URL error: ' + publicUrlError.message)
          return
        }

        image_url = publicUrlData.publicUrl
      }

      const { error } = await supabase.from('places').insert([
        {
          name: form.name,
          description: form.d
