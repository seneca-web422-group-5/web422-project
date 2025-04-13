// src/app/auth/signup/page.jsx
import React from 'react';
import SignupForm from '../../../components/SignupForm';

export default function SignupPage() {
  return (
    <div className="auth-page">
      <h1>Sign Up</h1>
      <SignupForm />
    </div>
  );
}
