export const navigateToRecipe = (navigate, id) => {
    if (id) {
      navigate(`/recipe/${id}`)
    }
  }