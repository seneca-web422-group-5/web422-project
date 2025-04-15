// 527600ec2dmsh22bea86f9657351p139636jsne4688cd85202
// https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_abf1bbc2-d08d-462b-b733-17392192ca46
// https://publicapi.dev/tasty-api

const BASE_URL = 'https://tasty.p.rapidapi.com'
const baseUrl = process.env.REACT_APP_API_URL || 'https://web422-project-server.vercel.app'
const API_KEY = process.env.REACT_APP_API_KEY // Store securely (e.g., env variables)

const fetchFromTastyAPI = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request Failed:', error)
    return null
  }
}

// Export functions
export const getRecipeDetails = (id) => fetchFromTastyAPI('recipes/detail', { id })
export const searchRecipes = (query = '', from = 0, size = 20) =>
  fetchFromTastyAPI('recipes/list', { q: query, from, size })
export const getAutoComplete = (query) =>
  fetchFromTastyAPI('recipes/auto-complete', { prefix: query })
export const getTags = (query) => fetchFromTastyAPI('tags/list')
export const getAutoCompleteSuggestions = (query) =>
  fetchFromTastyAPI('recipes/auto-complete', { prefix: query })
export const getPopularCategories = async () => {
  return fetchFromTastyAPI('tags/list')
}
export const getFeeds = (size = 1, timezone = '+0700', from = 0) =>
  fetchFromTastyAPI('feeds/list', { size, timezone, from })
export const getLatestRecipes = (from = 0, size = 100, tags = 'under_30_minutes') =>
  fetchFromTastyAPI('recipes/list', { from, size, tags })
export const getSimilarRecipes = (recipeId) =>
  fetchFromTastyAPI('recipes/list-similarities', { recipe_id: recipeId })
export const getFullDetail = (id) => fetchFromTastyAPI(`recipes/get-more-info`, { id })
// lib/api.js
export const getRandomRecipes = async () => {
  const res = await fetch(`${baseUrl}/api/random-recipes`)
  const data = await res.json()
  return data?.data || []
}


// Assign the object to a variable
const api = {
  getRecipeDetails,
  searchRecipes,
  getAutoComplete,
  getTags,
  getAutoCompleteSuggestions,
  getPopularCategories,
  getFeeds,
  getLatestRecipes,
  getTags,
  getFullDetail,
  getSimilarRecipes,
  getRandomRecipes
}

export default api
