import React from 'react'
import { useParams } from 'react-router-dom'

const RecipePage = () => {
  const { id } = useParams()

  return (
    <div className="container py-5">
      <h1>Recipe Page</h1>
      <p>Recipe ID: {id}</p>
      <p>This is a placeholder for the recipe details page.</p>
    </div>
  )
}

export default RecipePage
