// src/components/CommunityCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommunityCard = ({ user }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="card mb-3"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowModal(true)}
      >
        <div className="card-body text-left">
          <h5 className="card-title fs-4">{user.name}</h5>
          <p className="card-text fs-5 mb-1">
            <strong>Profession:</strong> {user.title || 'N/A'}
          </p>
          <p className="card-text fs-5">
            <strong>Location:</strong> {user.location || 'N/A'}
          </p>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{user.name}'s Profile</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-left">
                <p><strong>About Me:</strong> {user.bio || 'N/A'}</p>
                <p><strong>Profession:</strong> {user.title || 'N/A'}</p>
                <p><strong>Location:</strong> {user.location || 'N/A'}</p>
                <p><strong>Instagram:</strong> {user.instagram || 'N/A'}</p>
                <p>
                  <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                </p>
                <h6>Favorites:</h6>
                {user.favorites && user.favorites.length > 0 ? (
                  <ul>
                    {user.favorites.map(fav => (
                      <li key={fav.id}>
                        <Link to={`/recipe/${fav.id}`}>{fav.name}</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No favorites.</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityCard;
