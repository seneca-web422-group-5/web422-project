import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';


const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  // process.env.REACT_APP_API_URL ||

  const API_URL =  'https://web422-project-server.vercel.app';
  console.log("API_URL:", API_URL);


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/favorites`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading favorites...</p>;
  }

  return (
    <div className="container">
      <h2 className="mt-4">My Favorite Recipes ❤️</h2>
      <hr />
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <div className="categories-grid">
          {favorites.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img
                src={recipe.thumbnail_url || 'default-image.jpg'}
                alt={recipe.name}
                className="recipe-card-img"
              />
              <div className="recipe-card-body">
                <h3 className="recipe-card-title">{recipe.name}</h3>
                <div className="d-flex justify-content-between">
                  <Link to={`/recipe/${recipe._id}`}>
                    <button className="btn btn-primary btn-sm">View</button>
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(recipe._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination/>
        </div>
      )}
    </div>
  );
};

export default Favorites;
