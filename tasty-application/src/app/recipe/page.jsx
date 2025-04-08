import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullDetail } from '../../lib/api';

const RecipePage = () => {
  const { id } = useParams(); // Extract the recipe ID from the URL params
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const data = await getFullDetail(id); // Use the helper function
        setRecipeDetails(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching recipe details');
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails(); // Fetch data only if the ID exists
    }
  }, [id]);

  // Check if the recipe is already in favorites
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorited(favorites.some((fav) => fav.id === Number(id)));
  }, [id]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const updatedFavorites = isFavorited
      ? favorites.filter((fav) => fav.id !== Number(id))
      : [...favorites, {
          id: recipeDetails.id,
          name: recipeDetails.name,
          thumbnail_url: recipeDetails.thumbnail_url || recipeDetails.picture_url || '', // handle missing keys
        }];

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);

    // Inform other components about the change by updating the localStorage directly.
    window.dispatchEvent(new Event('favoriteChanged')); // Trigger event
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {recipeDetails ? (
        <div>
          <h1>{recipeDetails.name || 'No name available'}</h1>
          <img
            src={recipeDetails.thumbnail_url || 'default-image.jpg'}
            alt={recipeDetails.name || 'Recipe Image'}
            style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }}
          />

          <button
            onClick={handleToggleFavorite}
            style={{
              backgroundColor: isFavorited ? 'red' : '#ddd',
              color: isFavorited ? 'white' : 'black',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
          >
            {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
          </button>

          <p dangerouslySetInnerHTML={{ __html: recipeDetails.description || 'No description available' }} />
          <div>
            <h3>Cooktime: {recipeDetails.cook_time_minutes} minutes</h3>
            <h3>Instructions:</h3>
            <ol>
              {recipeDetails.instructions && recipeDetails.instructions.length > 0 ? (
                recipeDetails.instructions.map((instruction) => (
                  <li key={instruction.id}>{instruction.display_text}</li>
                ))
              ) : (
                <li>No instructions available</li>
              )}
            </ol>
          </div>
        </div>
      ) : (
        <div>No details available for this recipe.</div>
      )}
    </div>
  );
};

export default RecipePage;
