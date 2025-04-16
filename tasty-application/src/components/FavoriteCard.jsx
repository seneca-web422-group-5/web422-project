import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RecipeModal from './RecipeModal'
import { navigateToRecipe } from '../utils/helpers'
import api from '../lib/api'
import '../styles/RecipeCardWithDetail.css'

const FavoriteCardWithDetail = ({ recipe, onRemove }) => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCardClick = () => {
    navigateToRecipe(navigate, recipe.id)
  }

  const handleMoreInfo = async (e) => {
    e.stopPropagation()
    setLoading(true)
    try {
      const [fullRecipe, authorName] = await Promise.all([
        api.getFullDetail(recipe.id),
        api.getAuthorInfo(recipe.id),
      ])
  
      if (fullRecipe) {
        fullRecipe.credits = [{ name: authorName }]
        setSelectedRecipe(fullRecipe)
        setShowModal(true)
        setPage(1)
      } else {
        console.error('No full recipe data found')
      }
    } catch (err) {
      console.error('Error fetching full recipe or author:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRemove = (e) => {
    e.stopPropagation()
    if (onRemove) onRemove(recipe.id)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
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
          <button className="btn btn-secondary btn-sm" onClick={handleMoreInfo} disabled={loading}>
            {loading ? 'Loading...' : 'More Info'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>

      {showModal && selectedRecipe && (
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

export default FavoriteCardWithDetail
