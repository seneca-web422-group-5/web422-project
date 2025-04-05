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
      try {
        const data = await getFeeds(3, '+0700', 0)
        console.log('Raw API Data:', data)

        if (data && data.results) {
          const popularRecipesCarousel = data.results.find(
            (result) => result.type === 'carousel' && result.name === 'Popular Recipes This Week'
          )
          const popularRecipes = popularRecipesCarousel?.items || []
          const mappedRecommendations = popularRecipes.map((item) => ({
            id: item?.id,
            name: item?.name,
            thumbnail_url: item?.thumbnail_url,
            author: item?.credits?.[0]?.name || 'Unknown Author',
            tags: item?.tags?.map((tag) => tag.display_name) || [],
            user_ratings: item?.user_ratings || null
          }))
          console.log('Mapped Recommendations:', mappedRecommendations)
          setRecommendations(mappedRecommendations)
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to fetch recommendations.')
      }
    }

    const fetchCategories = async () => {
      try {
        const data = await getPopularCategories()
        console.log('Fetched Categories Data:', data)
        const popularCategories = data.results
          .filter((tag) => tag.type === 'meal')
          .map((tag) => ({ name: tag.display_name }))
        setCategories(popularCategories)
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
