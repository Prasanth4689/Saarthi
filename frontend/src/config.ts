// Central API configuration
// In local dev:  set VITE_API_BASE_URL=http://localhost:5000 in frontend/.env.local
// In production: set VITE_API_BASE_URL=https://your-backend.vercel.app in Vercel dashboard

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;
