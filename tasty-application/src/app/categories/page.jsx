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

        const categoryData = await getCachedData('tags', () => api.getTags())

        if (categoryData?.results) {
          const uniqueCategories = Array.from(
            new Map(categoryData.results.map((cat) => [cat.name, cat])).values()
          )

          uniqueCategories.sort((a, b) => a.display_name.localeCompare(b.display_name))
          setCategories(uniqueCategories)
        } else {
          setError('No categories available.')
        }
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch categories.')
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

  return (
    <>
      <div className="container">
        <h2 className="mt-4">Categories</h2>
        <hr />
        <div className="categories-grid">
          {currentCategories.map((category) => (
            <Link key={category.name} to={`/categories/${category.display_name}`}>
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
