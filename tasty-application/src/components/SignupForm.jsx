// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]         = useState('');
  const navigate                    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log("Signup response:", data);
      if (res.ok) {
        setMessage('Signup successful! Redirecting to login...');
        // Redirect to login page after successful signup
        navigate('/auth/login');
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage('Error during signup');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="signup-confirm">Confirm Password:</label>
        <input
          type="password"
          id="signup-confirm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
