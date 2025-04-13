// src/app/api/auth/signup/route.js

import { addUser } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const result = addUser(email, password);
    
    if (result.success) {
      return new Response(JSON.stringify({ message: 'User created successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: result.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Signup API Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
