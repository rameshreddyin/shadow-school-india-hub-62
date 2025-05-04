
/**
 * JWT utility functions for authentication and token management
 */

// Token storage keys
export const TOKEN_KEY = 'vidya_auth_token';
export const USER_DATA_KEY = 'vidya_user_data';

// Set authentication token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get authentication token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove authentication token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Check if token is valid
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Parse token without library dependency
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if token is expired
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Invalid token format');
    removeToken();
    return false;
  }
};

// Set user data
export const setUserData = (userData: any): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

// Get user data
export const getUserData = (): any => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};
