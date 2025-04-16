import { useState, useCallback, useEffect, useRef } from 'react'
import { getLatestRecipes } from '../../lib/api'

export const useLatestRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [from, setFrom] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 10

  const hasFetchedRef = useRef(false)

  const fetchMore = useCallback(async () => {
    try {
      const data = await getLatestRecipes(from, PAGE_SIZE, 'under_30_minutes')
      const newRecipes = (data?.results || [])
        .filter(r => r.id && r.created_at)
        .map(r => ({
          id: r.id,
          name: r.name,
          thumbnail_url: r.thumbnail_url,
          created_at: r.created_at
        }))

      setRecipes(prev => [...prev, ...newRecipes])
      setFrom(prev => prev + PAGE_SIZE)
      setHasMore(newRecipes.length > 0)
    } catch (err) {
      console.error('Error fetching latest recipes:', err)
    }
  }, [from])


  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchMore()
      hasFetchedRef.current = true
    }
  }, [fetchMore])

  return { recipes, fetchMore, hasMore }
}
