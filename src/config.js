// API Configuration
// Use environment variable VITE_API_URL or fallback to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 Frontend connected to Server at:', API_URL);
