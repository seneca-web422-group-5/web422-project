import React, { useEffect, useState } from 'react'
import { getAuthorInfo } from '../lib/api' 

const RecipeModal = ({ selectedRecipe, page, setPage, closeModal }) => {
  const [author, setAuthor] = useState('Loading...')

  useEffect(() => {
    const fetchAuthor = async () => {
      if (selectedRecipe?.id) {
        const name = await getAuthorInfo(selectedRecipe.id)
        setAuthor(name)
      }
    }
    fetchAuthor()
  }, [selectedRecipe?.id])

  if (!selectedRecipe) return null

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">{selectedRecipe.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {selectedRecipe.thumbnail_url && (
              <img
                src={selectedRecipe.thumbnail_url}
                alt={selectedRecipe.name}
                className="img-fluid mb-3"
                style={{ borderRadius: '8px' }}
              />
            )}
            {page === 1 && (
              <>
                <p>
                  <strong>Description:</strong>{' '}
                  {selectedRecipe.description ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: selectedRecipe.description }}
                    ></span>
                  ) : (
                    'No description available.'
                  )}
                </p>
              </>
            )}

            {page === 2 && (
              <>
                {selectedRecipe.prep_time_minutes && (
                  <p>
                    <strong>Prep Time:</strong> {selectedRecipe.prep_time_minutes} minutes
                  </p>
                )}
                {selectedRecipe.cook_time_minutes && (
                  <p>
                    <strong>Cook Time:</strong> {selectedRecipe.cook_time_minutes} minutes
                  </p>
                )}
                {selectedRecipe.total_time_minutes && (
                  <p>
                    <strong>Total Time:</strong> {selectedRecipe.total_time_minutes} minutes
                  </p>
                )}
                {selectedRecipe.servings && (
                  <p>
                    <strong>Servings:</strong> {selectedRecipe.servings}
                  </p>
                )}
                {selectedRecipe.nutrition && (
                  <div>
                    <strong>Nutrition:</strong>
                    <ul>
                      {Object.entries(selectedRecipe.nutrition)
                        .filter(([key]) => key !== 'updated_at')
                        .map(([key, value]) => (
                          <li key={key}>
                            {key}: {value}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            {page > 1 && (
              <button className="btn btn-primary" onClick={() => setPage(page - 1)}>
                Previous
              </button>
            )}
            {page < 2 && (
              <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
                Next
              </button>
            )}
            <button className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeModal
