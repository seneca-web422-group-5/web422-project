import React, { useEffect, useState } from 'react'
import { getFeeds, searchRecipes } from '../lib/api'
import RecommendByUs from '../components/RecommendByUs'

const Homepage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getFeeds(3, '+0700', 0)
        if (data && data.results) {
          setRecommendations(data.results)
        }
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch recommendations.')
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <RecommendByUs recommendations={recommendations} />
    </div>
  )
}

export default Homepage
