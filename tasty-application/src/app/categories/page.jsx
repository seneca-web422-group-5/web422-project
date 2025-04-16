import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import Pagination from '../../components/Pagination'
import CategoryCard from '../../components/CategoryCard'
import { useDataCache } from '../../context/DataCacheContext'
import Sort from '../../components/Sort'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [sortedCategories, setSortedCategories] = useState([])
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
        const [tagsRes, imageResRaw] = await Promise.all([
          getCachedData('tags', () => api.getTags()),
          fetch(categoryImagesUrl)
        ])

        if (!imageResRaw.ok) {
          const text = await imageResRaw.text()
          throw new Error(`Category images fetch failed: ${imageResRaw.status} - ${text}`)
        }

        const imagesRes = await imageResRaw.json()

        if (tagsRes?.results) {
          const normalize = (str) =>
            str?.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '')

          const imagesMap = new Map(
            (imagesRes?.data || []).map((img) => [normalize(img.categoryId), img.imageUrl])
          )

          const uniqueCategories = Array.from(
            new Map(tagsRes.results.map((cat) => [cat.name, cat])).values()
          ).map((cat) => {
            const normalizedName = normalize(cat.name)
            const image = imagesMap.get(normalizedName)

            return {
              ...cat,
              image: image || 'https://via.placeholder.com/150?text=No+Image'
            }
          })

          setCategories(uniqueCategories)
          setSortedCategories(uniqueCategories)
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

  const handleSortChange = (option, order) => {
    if (!option) {
      setSortedCategories([...categories])
      return
    }

    const fieldMap = {
      id: 'id',
      name: 'display_name'
    }

    const key = fieldMap[option] || option

    const sorted = [...categories].sort((a, b) => {
      let aVal = a[key] ?? ''
      let bVal = b[key] ?? ''

      if (typeof aVal === 'string') {
        return order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return order === 'asc' ? aVal - bVal : bVal - aVal
    })

    setSortedCategories(sorted)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(sortedCategories.length / ITEMS_PER_PAGE)
  const indexOfLast = currentPage * ITEMS_PER_PAGE
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE
  const currentCategories = sortedCategories.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const normalize = (str) =>
    str?.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, '')

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h2>Categories</h2>
          <Sort onSortChange={handleSortChange} />
        </div>
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
