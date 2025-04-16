import { useEffect, useState } from 'react'
import { getFeeds, getPopularCategories, getRandomRecipes } from '../../lib/api'

export const useHomepageData = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [randomRecipes, setRandomRecipes] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)

        const [rand, cats, recs] = await Promise.all([
          getRandomRecipes(),
          getPopularCategories(),
          getFeeds(3, '+0700', 0)
        ])

        setRandomRecipes(rand)

        setCategories(
          cats.results
            .filter((tag) => tag.type === 'meal')
            .map((tag) => ({ name: tag.display_name }))
        )

        const popular = recs.results.find((r) => r.type === 'carousel')
        const mapped = popular?.items?.map((item) => ({
          id: item.id,
          name: item.name,
          thumbnail_url: item.thumbnail_url,
          description: item.description || 'No description',
          user_ratings: item.user_ratings || null,
          tags: item.tags || [],
          credits: item.credits || []
        })) || []

        setRecommendations(mapped)
      } catch (err) {
        console.error(err)
        setError('Failed to load homepage content.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return {
    loading,
    error,
    categories,
    recommendations,
    randomRecipes
  }
}
