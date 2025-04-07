import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

const RecipeTable = () => {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  // Sample recipe data (50 items)
  const sampleRecipes = [
    { id: 1, name: 'Chocolate Chip Cookies', rating: 4 },
    { id: 2, name: 'Spaghetti Carbonara', rating: 5 },
    { id: 3, name: 'Avocado Toast', rating: 3 },
    { id: 4, name: 'Beef Wellington', rating: 5 },
    { id: 5, name: 'Vegetable Stir Fry', rating: 4 },
    { id: 6, name: 'Classic Pancakes', rating: 4 },
    { id: 7, name: 'Greek Salad', rating: 3 },
    { id: 8, name: 'Chicken Tikka Masala', rating: 5 },
    { id: 9, name: 'French Onion Soup', rating: 4 },
    { id: 10, name: 'Tiramisu', rating: 5 },
    { id: 11, name: 'Margherita Pizza', rating: 4 },
    { id: 12, name: 'Beef Burger', rating: 4 },
    { id: 13, name: 'Caesar Salad', rating: 3 },
    { id: 14, name: 'Mushroom Risotto', rating: 5 },
    { id: 15, name: 'Apple Pie', rating: 5 },
    { id: 16, name: 'Fish Tacos', rating: 4 },
    { id: 17, name: 'Pad Thai', rating: 4 },
    { id: 18, name: 'Chicken Parmesan', rating: 5 },
    { id: 19, name: 'Lemon Bars', rating: 4 },
    { id: 20, name: 'Beef Tacos', rating: 4 },
    { id: 21, name: 'Butternut Squash Soup', rating: 3 },
    { id: 22, name: 'Chocolate Mousse', rating: 5 },
    { id: 23, name: 'Eggplant Parmesan', rating: 4 },
    { id: 24, name: 'Garlic Bread', rating: 3 },
    { id: 25, name: 'Honey Glazed Salmon', rating: 5 },
    { id: 26, name: 'Ice Cream Sundae', rating: 5 },
    { id: 27, name: 'Jambalaya', rating: 4 },
    { id: 28, name: 'Key Lime Pie', rating: 5 },
    { id: 29, name: 'Lobster Bisque', rating: 5 },
    { id: 30, name: 'Mac and Cheese', rating: 4 },
    { id: 31, name: 'Nachos', rating: 3 },
    { id: 32, name: 'Omelette', rating: 3 },
    { id: 33, name: 'Peach Cobbler', rating: 4 },
    { id: 34, name: 'Quiche Lorraine', rating: 4 },
    { id: 35, name: 'Ratatouille', rating: 3 },
    { id: 36, name: 'Shrimp Scampi', rating: 5 },
    { id: 37, name: 'Tuna Salad', rating: 3 },
    { id: 38, name: 'Udon Noodle Soup', rating: 4 },
    { id: 39, name: 'Vanilla Cupcakes', rating: 4 },
    { id: 40, name: 'Waffles', rating: 4 },
    { id: 41, name: 'Xiaolongbao', rating: 5 },
    { id: 42, name: 'Yakitori', rating: 4 },
    { id: 43, name: 'Zucchini Bread', rating: 3 },
    { id: 44, name: 'Bibimbap', rating: 5 },
    { id: 45, name: 'Churros', rating: 4 },
    { id: 46, name: 'Dumplings', rating: 5 },
    { id: 47, name: 'Falafel', rating: 4 },
    { id: 48, name: 'Gazpacho', rating: 3 },
    { id: 49, name: 'Hummus', rating: 4 },
    { id: 50, name: 'Irish Stew', rating: 4 }
  ].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (!dataTableRef.current && tableRef.current) {
      const dt = $(tableRef.current).DataTable({
        data: sampleRecipes,
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
            width: '60%'  // Majority of width goes to Recipe Name
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
        autoWidth: false // Disable automatic column width calculation
      });

      dataTableRef.current = dt;

      // Event handlers (same as before)
      $(tableRef.current).on('click', '.btn-delete', function() {
        const id = parseInt($(this).data('id'));
        const row = $(this).closest('tr');
        dt.row(row).remove().draw();
      });

      $(tableRef.current).on('click', '.btn-edit', function() {
        const id = parseInt($(this).data('id'));
        alert(`Would edit recipe ${id}`);
      });
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [sampleRecipes]);

  return (
    <div className="recipe-table-container">
      <h2>Recipe Collection</h2>
      <table ref={tableRef} className="display" style={{ width: '100%' }} />
      
      <style jsx>{`
        .recipe-table-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        /* Table row styling */
        table.display tbody tr {
          height: 50px; /* Increased row height */
        }
        
        /* Recipe name cell styling */
        table.display td:nth-child(2) {
          padding-left: 15px;
          font-weight: 500;
        }
        
        /* Star rating styling */
        .star-rating {
          color: gold;
          font-size: 1.2em;
          display: inline-block;
          min-width: 100px;
        }
        
        /* Action buttons container */
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        /* Button styling */
        button {
          margin: 0;
          padding: 6px 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.9em;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        
        .btn-edit {
          background: #4CAF50;
          color: white;
        }
        
        .btn-edit:hover {
          background: #3e8e41;
        }
        
        .btn-delete {
          background: #f44336;
          color: white;
        }
        
        .btn-delete:hover {
          background: #d32f2f;
        }
        
        /* Header styling */
        table.display thead th {
          background-color: #f8f9fa;
          font-weight: 600;
          padding: 12px 15px;
        }
        
        /* Pagination styling */
        .dataTables_wrapper .dataTables_paginate .paginate_button {
          padding: 6px 12px;
          margin: 0 3px;
          border-radius: 4px;
        }
        
        .dataTables_wrapper .dataTables_paginate .paginate_button.current {
          background: #4CAF50;
          color: white !important;
          border: 1px solid #4CAF50;
        }
      `}</style>
    </div>
  );
};

export default RecipeTable;