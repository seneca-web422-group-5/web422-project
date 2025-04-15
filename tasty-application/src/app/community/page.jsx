// src/app/community/page.jsx
import React, { useState, useEffect } from 'react';
import CommunityCard from '../../components/CommunityCard';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://web422-project-server.vercel.app';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/community`);
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.error || 'Failed to load community.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [API_URL]);

  if (loading) return <p>Loading community...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Community</h1>
      <div className="row">
        {users.map(user => (
          <div key={user._id} className="col-md-4">
            <CommunityCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
