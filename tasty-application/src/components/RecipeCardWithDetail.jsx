import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { recentlyViewedAtom } from '../atoms/recentlyViewedAtom'
import { navigateToRecipe, addToRecentlyViewed } from '../utils/helpers'
import RecipeModal from './RecipeModal'
import '../styles/RecipeCardWithDetail.css'

const RecipeCardWithDetail = ({ recipe }) => {
  const navigate = useNavigate()
  const [recentlyViewed, setRecentlyViewed] = useAtom(recentlyViewedAtom)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  const handleMoreDetailsClick = (recipe) => {
    setSelectedRecipe(recipe)
    setShowModal(true)
    setPage(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
  }

  const handleCardClick = () => {
    addToRecentlyViewed(setRecentlyViewed, recipe)
    navigateToRecipe(navigate, recipe.id)
  }

  return (
    <>
      <div className="recipe-card">
        {/* Recipe Image */}
        <div className="recipe-card-image" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {recipe.thumbnail_url ? (
            <img src={recipe.thumbnail_url} alt={recipe.name} />
          ) : (
            <div className="recipe-card-no-image">No Image</div>
          )}
        </div>

        {/* Recipe Name */}
        <h3 className="recipe-card-title" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {recipe.name}
        </h3>

        {/* Total Time */}
        <p className="recipe-card-time">
          <i className="bi bi-clock" style={{ marginRight: '5px', color: '#7F7F7F' }}></i>
          {recipe.total_time_minutes ? `${recipe.total_time_minutes} mins` : 'N/A'}
        </p>

        {/* Info Icon */}
        <div
          className="more-info-icon d-flex justify-content-end"
          onClick={(e) => {
            e.stopPropagation()
            handleMoreDetailsClick(recipe)
          }}
        >
          <i className="bi bi-info-circle"></i>
        </div>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <RecipeModal
          selectedRecipe={selectedRecipe}
          page={page}
          setPage={setPage}
          closeModal={closeModal}
        />
      )}
    </>
  )
}

export default RecipeCardWithDetail
