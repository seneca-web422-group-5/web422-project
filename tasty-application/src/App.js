// 527600ec2dmsh22bea86f9657351p139636jsne4688cd85202
// https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_abf1bbc2-d08d-462b-b733-17392192ca46

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [recipes, setRecipes] = useState([]);  // Store recipes in state
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track any errors

  // Tasty API settings (use your own API key from RapidAPI)
  const apiKey = '527600ec2dmsh22bea86f9657351p139636jsne4688cd85202';  // Replace with your RapidAPI key
  const url = 'https://tasty.p.rapidapi.com/recipes/list'; // Example endpoint
  const query = 'chicken';  // Search query (change this for other searches)

  useEffect(() => {
    // Function to fetch recipes from Tasty API
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            'X-RapidAPI-Key': apiKey,  // Add your RapidAPI Key here
            'X-RapidAPI-Host': 'tasty.p.rapidapi.com',  // Tasty API host
          },
          params: { q: query },  // Query parameter (e.g., "chicken")
        });

        // Save the fetched recipes to state
        setRecipes(response.data.results);
        setLoading(false);  // Set loading state to false once data is fetched
      } catch (err) {
        setError('Error fetching data!');
        setLoading(false);
      }
    };

    fetchRecipes();  // Trigger the API call on component mount
  }, [apiKey, query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Recipes for "{query}"</h1>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <h2>{recipe.name}</h2>
            <img src={recipe.thumbnail_url} alt={recipe.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;