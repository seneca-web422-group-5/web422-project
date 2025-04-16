import "../styles/CategoryPage.css";

const formatCategoryName = (slug) => {
  return slug
    ?.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CategoryCard = ({ category }) => {
  return (
    <div className="general-category-card">
      <img
        src={category.image}
        alt={category.display_name}
        className="general-category-image"
      />
      <p className="general-category-name">
        {formatCategoryName(category.display_name)}
      </p>
    </div>
  );
};

export default CategoryCard;
