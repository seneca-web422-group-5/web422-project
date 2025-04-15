// CategoryCard.jsx
import "../styles/CategoryPage.css";

const CategoryCard = ({ category, imageUrl }) => {
  return (
    <div className="general-category-card">
      <img
        src={category.image}
        alt={category.display_name}
        className="general-category-image"
      />
      <p className="general-category-name">{category.display_name}</p>
    </div>
  );
};

export default CategoryCard;
