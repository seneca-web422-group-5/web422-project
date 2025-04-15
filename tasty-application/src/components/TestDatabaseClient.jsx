// Example: src/components/TestDatabaseClient.jsx
import React, { useEffect, useState } from 'react';

const TestDatabaseClient = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://web422-project-server.vercel.app';

  useEffect(() => {
    fetch(`${API_URL}/api/test-db`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>Test Database Data</h2>
      {users.length ? (
        <ul>
          {users.map(user => <li key={user._id}>{user.email}</li>)}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default TestDatabaseClient;
