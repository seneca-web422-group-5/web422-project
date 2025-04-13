// src/app/api/auth/login/route.js

import { validateUser } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (validateUser(email, password)) {
      return new Response(JSON.stringify({ message: 'Login successful' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Login API Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
