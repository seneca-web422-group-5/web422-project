import React from 'react'
import { useAtom } from 'jotai'
import { recentlyViewedAtom } from '../atoms/recentlyViewedAtom'
import { useNavigate } from 'react-router-dom'
import { navigateToRecipe } from '../utils/helpers'

const RecentlyView = () => {
    const [recentlyViewed] = useAtom(recentlyViewedAtom)
    const navigate = useNavigate()

    if (recentlyViewed.length === 0) {
        return <div className='text-center'>No recently viewed recipes yet</div>
    }

    return (
        <div>
            <h2>Recently Viewed Recipes</h2>
            <div className="recently-viewed-list">
                {recentlyViewed.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recently-viewed-card"
                        onClick={() => navigateToRecipe(navigate, recipe.id)}
                        style={{ cursor: 'pointer', marginBottom: '10px' }}
                    >
                        <img
                            src={recipe.thumbnail_url || 'https://via.placeholder.com/150'}
                            alt={recipe.name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                        />
                        <div>
                            <h4>{recipe.name}</h4>
                            <p>{recipe.total_time_minutes ? `${recipe.total_time_minutes} mins` : 'N/A'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecentlyView