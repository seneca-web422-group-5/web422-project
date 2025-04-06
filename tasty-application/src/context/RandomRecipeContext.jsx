import React, { createContext, useState, useContext } from 'react'

const RandomRecipeContext = createContext()

export const RandomRecipeProvider = ({ children }) => {
  const [randomRecipe, setRandomRecipe] = useState(null)

  return (
    <RandomRecipeContext.Provider value={{ randomRecipe, setRandomRecipe }}>
      {children}
    </RandomRecipeContext.Provider>
  )
}

export const useRandomRecipe = () => useContext(RandomRecipeContext)
