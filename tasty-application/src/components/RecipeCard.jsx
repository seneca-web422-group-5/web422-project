import "../styles/RecipeCard.css"

const RecipeCard = ({recipe}) => {
  return (
    <div className="recipe-card">
      <img
        src={recipe.thumbnail_url}
        alt={recipe.name}
        className="recipe-image"
      />
      <h5 className="recipe-name">{recipe.name}</h5>
      <h5 className="cook-time"> {recipe.cook_time_minutes} mins</h5>

      <button className="more-info">
        
      </button>
    </div>
  );
};

export default RecipeCard;
