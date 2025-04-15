import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import RecipeTablecss from '../styles/RecipeTablecss.css'

const API_URL = 'https://web422-project-server.vercel.app';

const RecipeTable = () => {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (data.success) {
          const formatted = data.favorites.map((fav, index) => ({
            id: fav.id,
            name: fav.name,
            rating: Math.floor(Math.random() * 3) + 3 // Fake ratings between 3-5
          }));
          setFavorites(formatted);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
            render: () => '<input type="checkbox" class="recipe-checkbox" />'
          },
          {
            title: 'Recipe Name',
            data: 'name',
            width: '60%'
          },
          {
            title: 'Rating',
            data: 'rating',
            width: '15%',
            render: (data) => {
              let stars = '';
              for (let i = 1; i <= 5; i++) {
                stars += i <= data ? '★' : '☆';
              }
              return `<span class="star-rating">${stars}</span>`;
            }
          },
          {
            title: 'Actions',
            data: null,
            orderable: false,
            width: '20%',
            render: (_, __, row) => `
              <div class="action-buttons">
                <button class="btn-edit" data-id="${row.id}">Edit</button>
                <button class="btn-delete" data-id="${row.id}">Delete</button>
              </div>
            `
          }
        ],
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        pagingType: 'full_numbers',
        dom: '<"top"lf>rt<"bottom"ip>',
        destroy: true,
        autoWidth: false
      });

      dataTableRef.current = dt;

      $(tableRef.current).on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        const row = $(this).closest('tr');
        dt.row(row).remove().draw();
      });

      $(tableRef.current).on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        alert(`Would edit recipe ${id}`);
      });
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [favorites, loading]);

  return (
    <div className="recipe-table-container">
      <h2>My Favorite Recipes</h2>
      {loading ? <p>Loading favorites...</p> : <table ref={tableRef} className="display" style={{ width: '100%' }} />}

      {/* Keep your styles here as before */}
    </div>
  );
};

export default RecipeTable;
