// src/app/auth/login/page.jsx
import React from 'react';
import LoginForm from '../../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
