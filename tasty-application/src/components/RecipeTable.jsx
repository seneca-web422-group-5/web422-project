import React, { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'
import { useNavigate } from 'react-router-dom'
import RecipeTablecss from '../styles/RecipeTablecss.css'

const API_URL = 'https://web422-project-server.vercel.app'

const RecipeTable = () => {
  const tableRef = useRef(null)
  const dataTableRef = useRef(null)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (data.success) {
          const formatted = data.favorites.map((fav) => ({
            id: fav.id,
            name: fav.name,
            thumbnail_url: fav.thumbnail_url,
            rating: Math.floor(Math.random() * 3) + 3, // Fake ratings
          }))
          setFavorites(formatted)
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  useEffect(() => {
    if (!loading && favorites.length && !dataTableRef.current && tableRef.current) {
      const dt = $(tableRef.current).DataTable({
        data: favorites,
        columns: [
          {
            title: 'Select',
            data: null,
            orderable: false,
            width: '5%',
            render: () => '<input type="checkbox" class="recipe-checkbox" />',
          },
          {
            title: 'Recipe Name',
            data: null,
            width: '50%',
            render: (data, type, row) => {
              return `<a href="/recipe/${row.id}" class="recipe-link">${row.name}</a>`
            },
          },
          {
            title: 'Rating',
            data: 'rating',
            width: '15%',
            render: (data) => {
              let stars = ''
              for (let i = 1; i <= 5; i++) {
                stars += i <= data ? '★' : '☆'
              }
              return `<span class="star-rating">${stars}</span>`
            },
          },
          {
            title: 'Actions',
            data: null,
            orderable: false,
            width: '20%',
            render: (_, __, row) => `
              <div class="action-buttons">
                <button class="btn-delete" data-id="${row.id}">Remove</button>
              </div>
            `,
          },
        ],
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        pagingType: 'full_numbers',
        dom: '<"top"lf>rt<"bottom"ip>',
        destroy: true,
        autoWidth: false,
      })

      dataTableRef.current = dt

      $(tableRef.current).on('click', '.btn-delete', async function () {
        const id = $(this).data('id')
        const row = $(this).closest('tr')

        try {
          const token = localStorage.getItem('token')
          const res = await fetch(`${API_URL}/api/favorites/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const data = await res.json()
          if (data.success) {
            dt.row(row).remove().draw()
          } else {
            console.error(data.error)
          }
        } catch (err) {
          console.error('Error removing favorite:', err)
        }
      })
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy()
        dataTableRef.current = null
      }
    }
  }, [favorites, loading])

  return (
    <div className="recipe-table-container">
      <h2>My Favorite Recipes</h2>
      {loading ? (
        <p>Loading favorites...</p>
      ) : (
        <table ref={tableRef} className="display" style={{ width: '100%' }} />
      )}
    </div>
  )
}

export default RecipeTable
