import "../styles/CategoryPage.css";

const formatCategoryName = (slug) => {
  return slug
    ?.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CategoryCard = ({ category }) => {
  const { image, display_name } = category;

  const isBuzzfeedImage = image?.includes("buzzfeed.com"); // or check your known source patterns
  const fallbackUrl = "/fallback.jpg";

  return (
    <div className="general-category-card">
      {isBuzzfeedImage ? (
        <picture>
          <source srcSet={`${image}&format=avif`} type="image/avif" />
          <source srcSet={`${image}&format=webp`} type="image/webp" />
          <img
            src={image}
            alt={display_name}
            className="general-category-image"
            loading="lazy"
            onError={(e) => { e.target.src = fallbackUrl }}
          />
        </picture>
      ) : (
        <img
          src={image || fallbackUrl}
          alt={display_name}
          className="general-category-image"
          loading="lazy"
          onError={(e) => { e.target.src = fallbackUrl }}
        />
      )}
      <p className="general-category-name">
        {formatCategoryName(display_name)}
      </p>
    </div>
  );
};

export default CategoryCard;
