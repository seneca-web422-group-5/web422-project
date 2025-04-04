import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { AuthContext } from '../../context/AuthContext';

const CategoryDetailPage = () => {
  const { categoryType } = useParams(); // Get categoryType from URL
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, login, logout } = useContext(AuthContext);
  
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (!user) {
      setError("Please log in to view recipes.");
      setLoading(false);
      return;
    }

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await api.searchRecipes(categoryType);
        setRecipes(data.results || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recipes.");
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryType, currentPage, user]);

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentRecipes = recipes.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>  
      <div>
        <h1>{categoryType} Recipes</h1>
        <div className="recipes-grid">
        {currentRecipes.map((recipe) => (
            <Link key={recipe.id}>
              {/* to={`/categories/${categoryType.display_name}/`} */}
              <RecipeCard recipe={recipe} />
            </Link>
          ))}
        </div>
      </div>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </>
  );
};

export default CategoryDetailPage;
