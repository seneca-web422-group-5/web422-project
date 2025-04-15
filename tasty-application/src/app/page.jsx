import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeeds, getPopularCategories, getLatestRecipes } from '../lib/api'
import JoinUs from '../components/JoinUs'
import PopularCategory from '../components/PopularCategory'
import RecommendByUs from '../components/RecommendByUs'
import LatestRecipes from '../components/LatestRecipes'
import DiscoverMenu from '../components/DiscoverMenu'
import HomePagecss from '../styles/HomePagecss.css';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'


const fetchRandomRecipes = async () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const res = await fetch(`${baseUrl}/api/random-recipes`)
  const data = await res.json()
  return data?.data || []
}

const Homepage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [latestRecipes, setLatestRecipes] = useState([])
  const [randomRecipes, setRandomRecipes] = useState([])
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0)
  const [from, setFrom] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const navigate = useNavigate()

  const handleRecipeClick = () => {
    const recipe = randomRecipes[currentRecipeIndex]
    if (recipe && recipe.id) {
      navigate(`/recipe/${recipe.id}`)
    }
  }

  const handleLoadMore = () => {
    fetchLatestRecipes(true)
  }

  const fetchLatestRecipes = async (append = false) => {
    try {
      const data = await getLatestRecipes(from, 10, 'under_30_minutes')

      if (data && data.results) {
        const newRecipes = data.results
          .filter((recipe) => recipe.id !== undefined && recipe.created_at !== null)
          .map((recipe) => ({
            id: recipe.id,
            name: recipe.name,
            thumbnail_url: recipe.thumbnail_url,
            created_at: recipe.created_at
          }))

        setLatestRecipes((prev) => (append ? [...prev, ...newRecipes] : newRecipes))
        setFrom((prev) => prev + 10)
        setHasMore(newRecipes.length > 0)
      }
    } catch (err) {
      console.error('Error fetching latest recipes:', err)
      setError('Failed to fetch latest recipes.')
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [rand, cats, recs] = await Promise.all([
          fetchRandomRecipes(),
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
          user_ratings: item.user_ratings || null
        })) || []
        setRecommendations(mapped)
        await fetchLatestRecipes()
      } catch (err) {
        console.error(err)
        setError('Failed to load content.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])


  useEffect(() => {
    if (randomRecipes.length > 0) {
      const interval = setInterval(() => {
        setCurrentRecipeIndex((prev) => (prev + 1) % randomRecipes.length)
      }, 50000)
      return () => clearInterval(interval)
    }
  }, [randomRecipes])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const randomRecipe = randomRecipes[currentRecipeIndex]

  return (
    <div>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="random-swiper mb-4"
      >
        {randomRecipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <div
              className="random-recipe bg-secondary p-4 mt-4 d-flex flex-column flex-md-row align-items-center"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              style={{ cursor: 'pointer' }}
            >
                {recipe.thumbnail_url && (
                  <img
                    src={recipe.thumbnail_url}
                    alt={recipe.name}
                    className="img-fluid mb-3 mb-md-0 me-md-4"
                    style={{ maxWidth: '300px', borderRadius: '8px' }}
                  />
                )}
                    <div className="random-recipe-info">
                      <h2 className="mb-5">Try this amazing recipe!</h2>
                      <h2 className="display-6">{recipe.name}</h2>
                      <p className="text-muted">{recipe.description || 'Try this amazing recipe!'}</p>
                    </div>
                  </div>
          </SwiperSlide>
                      ))}
      </Swiper>

      <DiscoverMenu recipeId={randomRecipe?.id} />
      <PopularCategory categories={categories} />
      <JoinUs />
      <RecommendByUs recommendations={recommendations} />
      <LatestRecipes recipes={latestRecipes} />
      {hasMore && (
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Homepage
