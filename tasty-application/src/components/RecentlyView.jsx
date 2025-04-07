import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { recentlyViewedAtom } from '../atoms/recentlyViewedAtom'
import RecipeCardWithDetail from './RecipeCardWithDetail'
import '../styles/RecentlyView.css'

const RecentlyView = () => {
    const [recentlyViewed] = useAtom(recentlyViewedAtom)
    const [currentPage, setCurrentPage] = useState(1)
    const recipesPerPage = 4 // Number of recipes per page

    // Calculate pagination
    const indexOfLastRecipe = currentPage * recipesPerPage
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
    const currentRecipes = recentlyViewed.slice(indexOfFirstRecipe, indexOfLastRecipe)
    const totalPages = Math.ceil(recentlyViewed.length / recipesPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    if (recentlyViewed.length === 0) {
        return <div className="text-center">No recently viewed recipes yet</div>
    }

    return (
        <div className="recently-viewed-container">
            <h2 className="mb-4 text-center">Recently Viewed Recipes</h2>
            <div className="recipe-grid">
                {currentRecipes.map((recipe) => (
                    <RecipeCardWithDetail key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination d-flex justify-content-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default RecentlyView