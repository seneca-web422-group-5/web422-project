import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/RecipeCardNormal.css";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if the recipe is in the favorites list (on initial render)
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorited(favorites.some((fav) => fav.id === recipe.id));
  }, [recipe.id]);

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`); // Navigate to the recipe detail page
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation(); // Prevent the click from triggering handleRecipeClick

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter((fav) => fav.id !== recipe.id);
    } else {
      updatedFavorites = [
        ...favorites,
        {
          id: recipe.id,
          name: recipe.name,
          thumbnail_url: recipe.thumbnail_url || 'default-image.jpg', // Handle missing thumbnail
        },
      ];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  // Helper function to render stars
  const renderStars = (score) => {
    const maxStars = 5;
    const filledStars = Math.round(score * maxStars); // Convert score (0-1) to stars (0-5)
    return (
      <div className="recommend-card-stars d-flex justify-content-center mb-0">
        {[...Array(maxStars)].map((_, index) => (
          <span key={index} className={index < filledStars ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="recommend-card">
      {/* Image */}
      <div className="recommend-card-image" onClick={handleRecipeClick} style={{ cursor: 'pointer' }}>
        {recipe.thumbnail_url ? (
          <img src={recipe.thumbnail_url} alt={recipe.name} />
        ) : (
          <div className="recommend-card-no-image">No Image</div>
        )}
      </div>

      {/* Recipe Name */}
      <h3 className="recommend-card-title" onClick={handleRecipeClick} style={{ cursor: 'pointer' }}>
        {recipe.name}
      </h3>

      {/* Rating */}
      {recipe.user_ratings && recipe.user_ratings.score ? (
        <div>
          {renderStars(recipe.user_ratings.score)}
          <p className="recommend-card-rating-count mt-0">
            {recipe.user_ratings.count_positive} positive ratings
          </p>
        </div>
      ) : (
        <p className="recommend-card-no-rating">No Ratings</p>
      )}

      <div className="recommend-card-icons d-flex justify-content-between" style={{ marginTop: '10px' }}>
        {/* Favorite Heart Icon */}
        <div
          className="recommend-card-favorite-icon"
          onClick={handleFavoriteToggle} // Only toggles the favorite state
          style={{
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          <i
            className={`bi bi-heart${isFavorited ? '' : '-fill'}`}
            style={{
              color: isFavorited ? 'red' : 'white', // Red if favorited
              backgroundColor: isFavorited ? 'transparent' : '#d3d3d3', // Gray background if not favorited
              borderRadius: '50%',
              padding: '5px',
              border: isFavorited ? 'none' : '1px solid #d3d3d3', // Border if not favorited
            }}
          />
        </div>

        {/* More Info Icon */}
        <div
          className="recommend-card-info-icon"
          onClick={handleRecipeClick} // Navigate to the recipe detail page
          style={{ cursor: 'pointer', textAlign: 'center' }}
        >
          <i className="bi bi-info-circle" style={{ fontSize: '20px', color: '#007bff' }}></i>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
