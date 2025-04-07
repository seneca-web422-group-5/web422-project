import React from 'react'

const RecipeModal = ({ selectedRecipe, page, setPage, closeModal }) => {
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
                {/* Page 1: Basic Details */}
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
                <p>
                  <strong>Author:</strong>{' '}
                  {selectedRecipe.author ? selectedRecipe.author : 'Author information not available.'}
                </p>
              </>
            )}

            {page === 2 && (
              <>
                {/* Page 2: Additional Details */}
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
                        .filter(([key]) => key !== 'updated_at') // Exclude the updated_at field
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
            {/* Navigation Buttons */}
            {page > 1 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
            )}
            {page < 2 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeModal