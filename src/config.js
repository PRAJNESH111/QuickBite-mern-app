// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://gofood-backend-1o90.onrender.com';

// Debug logging
console.log('Environment API URL:', process.env.REACT_APP_API_URL);
console.log('Final API URL:', API_URL);

export { API_URL };

// You can add other configuration variables here
export const API_ENDPOINTS = {
    // Add your API endpoints here
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    // Add more endpoints as needed
};