import React, { useEffect, useState } from 'react'
import { getFeeds } from '../lib/api'
import RecommendByUs from '../components/RecommendByUs'

const Homepage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getFeeds(3, '+0700', 0)
        console.log('Raw API Data:', data)

        if (data && data.results) {
          // Find the carousel with the name "Popular Recipes This Week"
          const popularRecipesCarousel = data.results.find(
            (result) => result.type === 'carousel' && result.name === 'Popular Recipes This Week'
          )

          // Extract the items from the carousel
          const popularRecipes = popularRecipesCarousel?.items || []

          // Map the items to extract relevant fields
          const mappedRecommendations = popularRecipes.map((item) => ({
            id: item?.id,
            name: item?.name,
            thumbnail_url: item?.thumbnail_url,
            author: item?.credits?.[0]?.name || 'Unknown Author',
            tags: item?.tags?.map((tag) => tag.display_name) || []
          }))
          console.log('Mapped Recommendations:', mappedRecommendations)
          setRecommendations(mappedRecommendations)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to fetch recommendations.')
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <RecommendByUs recommendations={recommendations} />
    </div>
  )
}

export default Homepage
