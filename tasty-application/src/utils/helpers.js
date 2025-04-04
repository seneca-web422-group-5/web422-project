export const filterRecipesByTag = (recipes, tagName) => {
    return recipes.filter((recipe) =>
      recipe.tags?.some((tag) => tag.name === tagName)
    );
  };
  