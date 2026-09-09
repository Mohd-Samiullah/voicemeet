// client/src/config.js
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const API_BASE = `${BACKEND_URL}/api`;
export const SOCKET_SERVER = BACKEND_URL;