import React from 'react'
import HomePagecss from '../styles/HomePagecss.css'
import HeroCarousel from '../components/HeroCarousel'
import { useHomepageData } from '../app/hooks/useHomepageData'
import { useLatestRecipes } from '../app/hooks/UseLatestRecipes'
import DiscoverMenu from '../components/DiscoverMenu'
import JoinUs from '../components/JoinUs'
import PopularCategory from '../components/PopularCategory'
import RecommendByUs from '../components/RecommendByUs'
import LatestRecipes from '../components/LatestRecipes'

const Homepage = () => {
  const { loading, error, categories, recommendations, randomRecipes } = useHomepageData()
  const { recipes: latestRecipes, fetchMore, hasMore } = useLatestRecipes()

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <HeroCarousel recipes={randomRecipes} />
      <DiscoverMenu recipeId={randomRecipes[0]?.id} />
      <PopularCategory categories={categories} />
      <JoinUs />
      <RecommendByUs recommendations={recommendations} />
      <LatestRecipes recipes={latestRecipes} />
      {hasMore && (
        <div className="text-center">
          <button className="btn btn-primary" onClick={fetchMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Homepage
