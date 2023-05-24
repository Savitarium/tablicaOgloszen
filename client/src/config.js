export const API_ADS_URL = process.env.NODE_ENV === 'production' ? '/api/ads/' : 'http://localhost:8000/api/ads/';
export const IMGS_URL = process.env.NODE_ENV === 'production' ? 'public/uploads/' : 'http://localhost:8000/uploads/';
export const API_AUTH_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000/';
