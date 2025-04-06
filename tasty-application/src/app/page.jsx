import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeeds, getPopularCategories } from '../lib/api'
import JoinUs from '../components/JoinUs'
import PopularCategory from '../components/PopularCategory'
import RecommendByUs from '../components/RecommendByUs'
import LatestRecipes from '../components/LatestRecipes'

const Homepage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [randomRecipe, setRandomRecipe] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [latestRecipes, setLatestRecipes] = useState([])
  const navigate = useNavigate()

  const handleRecipeClick = () => {
    if (randomRecipe && randomRecipe.id) {
      navigate(`/recipe/${randomRecipe.id}`)
    }
  }

  useEffect(() => {
    const fetchRandomRecipe = async () => {
      // Check if randomRecipe is already in localStorage
      const cachedRandomRecipe = localStorage.getItem('randomRecipe')
      if (cachedRandomRecipe) {
        try {
          const { data, timestamp } = JSON.parse(cachedRandomRecipe)
          const isExpired = Date.now() - timestamp > 86400000 // 1 day in milliseconds
          if (!isExpired) {
            setRandomRecipe(data)
            console.log('Loaded randomRecipe from localStorage')
            return
          }
        } catch (e) {
          console.error('Failed to parse cached randomRecipe:', e)
        }
      }

      // Fetch a new random recipe from the API
      try {
        const feedData = await getFeeds(5, '+0700', false)
        if (feedData && feedData.results && feedData.results.length > 0) {
          const recipeItems = feedData.results.filter((item) => item.type === 'featured')
          if (recipeItems.length > 0) {
            const newRandomRecipe = recipeItems[0].item
            setRandomRecipe(newRandomRecipe)

            // Save to localStorage with a timestamp
            localStorage.setItem(
              'randomRecipe',
              JSON.stringify({ data: newRandomRecipe, timestamp: Date.now() })
            )
            console.log('Saved randomRecipe to localStorage')
          } else {
            console.warn('No recipe items found in the feed.')
          }
        }
      } catch (err) {
        console.error('Error fetching randomRecipe:', err)
        setError('Failed to fetch random recipe.')
      }
    }

    const fetchRecommendations = async () => {
      try {
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

        const data = await getFeeds(3, '+0700', 0)
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
            user_ratings: item?.user_ratings || null,
            description: item?.description || 'No description available.',
            video_url: item?.video_url || null,
            instructions: item?.instructions || [],
            prep_time_minutes: item?.prep_time_minutes || null,
            cook_time_minutes: item?.cook_time_minutes || null,
            total_time_minutes: item?.total_time_minutes || null,
            servings: item?.servings || null,
            nutrition: item?.nutrition || null,
            created_at: item?.created_at || null 
          })) || []

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

    const fetchLatestRecipes = async () => {
      try {
        const data = await getFeeds(100, '+0700', 0)
        console.log('API Response:', data)
    
        if (data && data.results) {
          const allRecipes = data.results
            .filter((result) => result.type === 'item' && result.item?.id !== undefined && result.item?.created_at !== null)
            .map((result) => ({
              id: result.item?.id,
              name: result.item?.name,
              thumbnail_url: result.item?.thumbnail_url,
              created_at: result.item?.created_at
            }))
    
          console.log('Filtered Recipes:', allRecipes)
    
          // Sort recipes by created_at in descending order
          const sortedRecipes = allRecipes.sort((a, b) => b.created_at - a.created_at)
    
          setLatestRecipes(sortedRecipes)
        }
      } catch (err) {
        console.error('Error fetching latest recipes:', err)
        setError('Failed to fetch latest recipes.')
      }
    }

    const fetchCategories = async () => {
      try {
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

        const data = await getPopularCategories()
        if (data && data.results) {
          const popularCategories = data.results
            .filter((tag) => tag.type === 'meal')
            .map((tag) => ({ name: tag.display_name }))

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
      await Promise.all([fetchRandomRecipe(), fetchRecommendations(), fetchCategories(), fetchLatestRecipes()])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      {randomRecipe && (
        <div
          className="random-recipe bg-light p-4 mb-4 mt-4 d-flex flex-column flex-md-row align-items-center"
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
      <PopularCategory categories={categories} />
      <JoinUs />
      <RecommendByUs recommendations={recommendations} />
      <LatestRecipes recipes={latestRecipes} />
    </div>
  )
}

export default Homepage