import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeeds, getPopularCategories } from '../lib/api'
import { useRandomRecipe } from '../context/RandomRecipeContext'
import JoinUs from '../components/JoinUs'
import PopularCategory from '../components/PopularCategory'
import RecommendByUs from '../components/RecommendByUs'

const Homepage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const { randomRecipe, setRandomRecipe } = useRandomRecipe()
  const navigate = useNavigate()

  const handleRecipeClick = () => {
    if (randomRecipe && randomRecipe.id) {
      navigate(`/recipe/${randomRecipe.id}`)
    }
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Check if recommendations are already in localStorage
      const cachedRecommendations = localStorage.getItem('recommendations')
      if (cachedRecommendations) {
        const { data, timestamp } = JSON.parse(cachedRecommendations)
        const isExpired = Date.now() - timestamp > 86400000 // 1 day in milliseconds
        if (!isExpired) {
          setRecommendations(data)
          console.log('Loaded recommendations from localStorage')
          return
        }
      }

      try {
        // Fetch random recipe only if it's not already set
        if (!randomRecipe) {
          const feedData = await getFeeds(5, '+0700', false)
          if (feedData && feedData.results && feedData.results.length > 0) {
            const recipeItems = feedData.results.filter((item) => item.type === 'featured')
            if (recipeItems.length > 0) {
              setRandomRecipe(recipeItems[0].item) // Save to context
            } else {
              console.warn('No recipe items found in the feed.')
            }
          }
        }

        const data = await getFeeds(3, '+0700', 0)
        console.log('Raw API Data:', data)

        if (data && data.results) {
          const popularRecipesCarousel = data.results.find(
            (result) => result.type === 'carousel' && result.name === 'Popular Recipes This Week'
          )
          const mappedRecommendations = popularRecipesCarousel?.items?.map((item) => ({
            id: item?.id,
            name: item?.name,
            thumbnail_url: item?.thumbnail_url,
            author: item?.credits?.[0]?.name || 'Unknown Author',
            tags: item?.tags?.map((tag) => tag.display_name) || [],
            user_ratings: item?.user_ratings || null
          })) || []

          // Save recommendations to localStorage with a timestamp
          localStorage.setItem(
            'recommendations',
            JSON.stringify({ data: mappedRecommendations, timestamp: Date.now() })
          )
          console.log('Saved recommendations to localStorage')
          setRecommendations(mappedRecommendations)
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to fetch recommendations.')
      }
    }

    const fetchCategories = async () => {
      try {
        // Check if categories are already in localStorage
        const cachedCategories = localStorage.getItem('categories')
        if (cachedCategories) {
          const { data, timestamp } = JSON.parse(cachedCategories)
          const isExpired = Date.now() - timestamp > 86400000 // 1 day in milliseconds
          if (!isExpired) {
            setCategories(data)
            console.log('Loaded categories from localStorage')
            return
          }
        }

        // Fetch categories from API
        const data = await getPopularCategories()
        if (data && data.results) {
          const popularCategories = data.results
            .filter((tag) => tag.type === 'meal')
            .map((tag) => ({ name: tag.display_name }))

          // Save categories to localStorage with a timestamp
          localStorage.setItem(
            'categories',
            JSON.stringify({ data: popularCategories, timestamp: Date.now() })
          )
          console.log('Saved categories to localStorage')
          setCategories(popularCategories)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to fetch categories.')
      }
    }

    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchRecommendations(), fetchCategories()])
      setLoading(false)
    }

    fetchData()
  }, [randomRecipe, setRandomRecipe])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <RecommendByUs recommendations={recommendations} />
      <PopularCategory categories={categories} />
      {randomRecipe && (
        <div
          className="random-recipe bg-light p-4 mb-4 d-flex flex-column flex-md-row align-items-center"
          onClick={handleRecipeClick}
          style={{ cursor: 'pointer' }}
        >
          {randomRecipe.thumbnail_url && (
            <img
              src={randomRecipe.thumbnail_url}
              alt={randomRecipe.name}
              className="img-fluid mb-3 mb-md-0 me-md-4"
              style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
          )}
          <div>
            <h1 className="mb-5">Try this amazing recipe!</h1>
            <h2 className="display-6">{randomRecipe.name}</h2>
            <p className="text-muted">{randomRecipe.description || 'Try this amazing recipe!'}</p>
          </div>
        </div>
      )}
      <JoinUs />
    </div>
  )
}

export default Homepage
