import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import Pagination from '../../components/Pagination'
import CategoryCard from '../../components/CategoryCard'
import { useDataCache } from '../../context/DataCacheContext'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getCachedData } = useDataCache()

  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
  
        const categoryImagesUrl = `${process.env.REACT_APP_API_URL}/api/category-images`
        console.log("Fetching category images from:", categoryImagesUrl)
  
        const [tagsRes, imageResRaw] = await Promise.all([
          getCachedData('tags', () => api.getTags()),
          fetch(categoryImagesUrl)
        ])
  
        if (!imageResRaw.ok) {
          const text = await imageResRaw.text()
          throw new Error(`Category images fetch failed: ${imageResRaw.status} - ${text}`)
        }
  
        const imagesRes = await imageResRaw.json()
        console.log("Fetched images from backend:", imagesRes.data)
  
        if (tagsRes?.results) {
          const normalize = (str) =>
            str?.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '')
  
          const imagesMap = new Map(
            (imagesRes?.data || []).map((img) => [normalize(img.categoryId), img.imageUrl])
          )
  
          console.log("Normalized image keys:", [...imagesMap.keys()])
  
          const uniqueCategories = Array.from(
            new Map(tagsRes.results.map((cat) => [cat.name, cat])).values()
          ).map((cat) => {
            const normalizedName = normalize(cat.name)
            const image = imagesMap.get(normalizedName)
  
            return {
              ...cat,
              image: image || "https://via.placeholder.com/150?text=No+Image"
            }
          })
  
          uniqueCategories.sort((a, b) => a.display_name.localeCompare(b.display_name))
          setCategories(uniqueCategories)
        } else {
          setError('No categories available.')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(`Failed to fetch categories: ${err.message || err}`)
      } finally {
        setLoading(false)
      }
    }
  
    fetchCategories()
  }, [getCachedData])
  

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE)

  const indexOfLast = currentPage * ITEMS_PER_PAGE
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE
  const currentCategories = categories.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  const normalize = (str) =>
    str?.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '');
  
  return (
    <>
      <div className="container">
        <h2 className="mt-4">Categories</h2>
        <hr />
        <div className="categories-grid">
          {currentCategories.map((category) => (
           <Link key={category.name} to={`/categories/${normalize(category.display_name)}`}>
              <CategoryCard category={category} />
            </Link>
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default Categories
