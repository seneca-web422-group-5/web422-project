// src/app/profile/page.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://web422-project-server.vercel.app';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for toggling edit mode for personal info.
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    title: '',
    location: '',
    instagram: ''
  });
  
  // State for changing password.
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');

  // Fetch the profile data on mount.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: 'Bearer ' + token }
        });
        const result = await response.json();
        if (result.success) {
          setProfile(result.user);
          // Pre-fill the edit form with the current details.
          setEditData({
            name: result.user.name || '',
            bio: result.user.bio || '',
            title: result.user.title || '',
            location: result.user.location || '',
            instagram: result.user.instagram || ''
          });
        } else {
          setError(result.error || 'Failed to load profile.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate('/auth/login');
    }
  }, [API_URL, token, navigate]);

  // Handle changes in the edit form.
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile information.
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(editData)
      });
      const result = await response.json();
      if (result.success) {
        setProfile((prev) => ({ ...prev, ...editData }));
        setEditMode(false);
      } else {
        alert(result.error || 'Failed to update profile.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle changes in the password form.
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the password change request.
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
      const result = await response.json();
      if (result.success) {
        setPasswordMessage("Password updated successfully.");
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage(result.error || "Failed to update password.");
      }
    } catch (err) {
      setPasswordMessage(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-start display-4">Profile</h1>
      
      {/* Profile Information Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 fs-3">Personal Information</h2>
        </div>
        <div className="card-body text-start">
          {!editMode ? (
            <div className="fs-4">
              <p><span className="fw-bold">Name:</span> {profile.name}</p>
              <p><span className="fw-bold">Email:</span> {profile.email}</p>
              <p><span className="fw-bold">About Me:</span> {profile.bio || "N/A"}</p>
              <p><span className="fw-bold">Title/Profession:</span> {profile.title || "N/A"}</p>
              <p><span className="fw-bold">Location:</span> {profile.location || "N/A"}</p>
              <p><span className="fw-bold">Instagram:</span> {profile.instagram || "N/A"}</p>
              <p><span className="fw-bold">Member since:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
              <p>
                <span className="fw-bold">Last Login:</span>{" "}
                {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A'}
              </p>
              <button className="btn btn-secondary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="form-label fs-5">Name</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  name="name" 
                  value={editData.name} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fs-5">About Me</label>
                <textarea 
                  className="form-control form-control-lg" 
                  name="bio" 
                  value={editData.bio} 
                  onChange={handleEditChange} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fs-5">Title/Profession</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  name="title" 
                  value={editData.title} 
                  onChange={handleEditChange} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fs-5">Location</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  name="location" 
                  value={editData.location} 
                  onChange={handleEditChange} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fs-5">Instagram URL</label>
                <input 
                  type="url" 
                  className="form-control form-control-lg" 
                  name="instagram" 
                  value={editData.instagram} 
                  onChange={handleEditChange} 
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg me-2">Save Changes</button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white">
          <h2 className="mb-0 fs-3">Change Password</h2>
        </div>
        <div className="card-body text-start">
          {passwordMessage && <p className="fs-5 text-warning">{passwordMessage}</p>}
          <form onSubmit={handlePasswordSubmit} className="w-50">
            <div className="mb-3">
              <label className="form-label fs-5">Old Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                name="oldPassword" 
                value={passwordData.oldPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label fs-5">New Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                name="newPassword" 
                value={passwordData.newPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label fs-5">Confirm New Password</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                name="confirmPassword" 
                value={passwordData.confirmPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
