import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RecipeModal from './RecipeModal'
import { navigateToRecipe } from '../utils/helpers'
import '../styles/RecipeCardWithDetail.css'

const FavoriteCardWithDetail = ({ recipe, onRemove }) => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  const handleCardClick = () => {
    navigateToRecipe(navigate, recipe.id)
  }

  const handleMoreInfo = (e) => {
    e.stopPropagation()
    setShowModal(true)
    setPage(1)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    if (onRemove) onRemove(recipe._id)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <div className="recipe-card">
        <div className="recipe-card-image" onClick={handleCardClick}>
          {recipe.thumbnail_url ? (
            <img src={recipe.thumbnail_url} alt={recipe.name} />
          ) : (
            <div className="recipe-card-no-image">No Image</div>
          )}
        </div>

        <h3 className="recipe-card-title" onClick={handleCardClick}>
          {recipe.name}
        </h3>

        <div className="d-flex justify-content-between mt-2 gap-2">
          <button className="btn btn-primary btn-sm" onClick={handleCardClick}>
            View
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleMoreInfo}>
            More Info
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>

      {showModal && (
        <RecipeModal
          selectedRecipe={recipe}
          page={page}
          setPage={setPage}
          closeModal={closeModal}
        />
      )}
    </>
  )
}

export default FavoriteCardWithDetail
