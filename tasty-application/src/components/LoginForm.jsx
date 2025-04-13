// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (res.ok) {
        setMessage('Login successful!');
        // Redirect to home page (or dashboard) after successful login
        navigate('/');
      } else {
        setMessage(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage('Error logging in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}
