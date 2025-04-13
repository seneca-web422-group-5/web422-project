// src/mocks/handlers.js
import * as MSW from 'msw';

const { rest } = MSW;

// Hardcoded users for simulation
const users = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'user@example.com', password: 'pass456' },
];

export const handlers = [
  // Login endpoint handler
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    const foundUser = users.find(
      user => user.email === email && user.password === password
    );
    if (foundUser) {
      return res(
        ctx.status(200),
        ctx.json({ message: 'Login successful' })
      );
    }
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' })
    );
  }),

  // Signup endpoint handler
  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { email, password } = req.body;
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'User already exists' })
      );
    }
    users.push({ email, password });
    return res(
      ctx.status(200),
      ctx.json({ message: 'User created successfully' })
    );
  }),
];
