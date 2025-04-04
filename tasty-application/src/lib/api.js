// 527600ec2dmsh22bea86f9657351p139636jsne4688cd85202
// https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_abf1bbc2-d08d-462b-b733-17392192ca46
// https://publicapi.dev/tasty-api

const BASE_URL = 'https://tasty.p.rapidapi.com'
const API_KEY = '30f4561ac7msh7c130f6beaab83bp1436c5jsn564fb26bc065' // Store securely (e.g., env variables)

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
export const searchRecipes = (query) => fetchFromTastyAPI('recipes/list', { q: query })
export const getAutoComplete = (query) =>
  fetchFromTastyAPI('recipes/auto-complete', { prefix: query })
export const getPopularCategories = async () => {
  return fetchFromTastyAPI('tags/list')
}

// Assign the object to a variable
const api = {
  getRecipeDetails,
  searchRecipes,
  getAutoComplete,
  getPopularCategories
}

// Export the variable as the default export
export default api
