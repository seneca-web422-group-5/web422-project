import "../styles/Category.css"

const CategoryCard = ({ category }) => {
  return (
    <div className="general-category-card">
      <img
        src={category.image}
        alt={category.display_name}
        className="general-category-image"
      />
      <p className="genereal-category-name">{category.display_name}</p>
    </div>
  );
};

export default CategoryCard;
