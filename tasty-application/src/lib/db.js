// src/lib/db.js

// A simple, in-memory “database”
const users = [
  { email: 'test@example.com', password: 'password123' },
];

export function findUserByEmail(email) {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function validateUser(email, password) {
  const user = findUserByEmail(email);
  return user && user.password === password;
}

export function addUser(email, password) {
  if (findUserByEmail(email)) {
    return { success: false, message: 'User already exists' };
  }
  users.push({ email, password });
  return { success: true };
}
